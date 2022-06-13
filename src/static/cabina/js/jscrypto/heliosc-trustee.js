/*
  Copyright © 2013 Inria. All rights reserved.
  Author: Stéphane Glondu <Stephane.Glondu@inria.fr>
  This program is free software: you can redistribute it and/or modify
  it under the terms of the GNU General Public License as published by
  the Free Software Foundation, either version 3 of the License, or
  (at your option) any later version.
  This program is distributed in the hope that it will be useful,
  but WITHOUT ANY WARRANTY; without even the implied warranty of
  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
  GNU General Public License for more details.
  You should have received a copy of the GNU General Public License
  along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/
import { sjcl } from "./sjcl";
import { Random } from "./random";
import { BigInt } from "./bigint";
import { BigInteger } from "./jsbn";
import $ from "jquery";


class Heliosc {
  constructor() {
    this.params = {};
    this.certificates = {};
    this.trustee = {};
    this.secret_key = undefined;
    this.points = [];
    this.sum = BigInteger.ZERO;
  }

  hash(data) {
    return sjcl.codec.hex.fromBits(sjcl.hash.sha256.hash(data));
  }

  signature_sign(sk, m) {
    var pk = sk.public_key;
    var w = Random.getRandomInteger(pk.q);
    var A = pk.g.modPow(w, pk.p);
    var tmp = this.hash("sign|" + A.toString() + "|" + m);
    var C = new BigInt(tmp, 16).mod(pk.q);
    // we do (q-x*challenge)+w instead of directly w-x*challenge,
    // in case mod doesn't support negative numbers as expected
    var R = pk.q.subtract(sk.x.multiply(C).mod(pk.q));
    R = R.add(w).mod(pk.q);
    return { challenge: C.toString(), response: R.toString() };
  }

  signature_check(pk, m, s) {
    var C = new BigInt(s.challenge);
    var R = new BigInt(s.response);
    var A = pk.g.modPow(R, pk.p).multiply(pk.y.modPow(C, pk.p)).mod(pk.p);
    var tmp = this.hash("sign|" + A.toString() + "|" + m);
    return new BigInt(tmp, 16).mod(pk.q).compareTo(C) == 0;
  }

  encryption_encrypt(pk, m) {
    var r = Random.getRandomInteger(pk.q);
    var alpha = pk.g.modPow(r, pk.p).toString();
    var key = pk.y.modPow(r, pk.p);
    key = this.hash(key.toString(16));
    key = sjcl.codec.hex.toBits(key);
    var aes = new sjcl.cipher.aes(key);
    var a = sjcl.codec.utf8String.toBits(alpha);
    var b = sjcl.codec.utf8String.toBits(m);
    var beta = sjcl.mode.ccm.encrypt(aes, b, a);
    return {
      alpha: alpha,
      beta: sjcl.codec.hex.fromBits(beta),
    };
  }

  encryption_decrypt(sk, m) {
    var pk = sk.public_key;
    var alpha = new BigInt(m.alpha);
    var key = alpha.modPow(sk.x, pk.p);
    key = this.hash(key.toString(16));
    key = sjcl.codec.hex.toBits(key);
    var aes = new sjcl.cipher.aes(key);
    var a = sjcl.codec.utf8String.toBits(m.alpha);
    var b = sjcl.codec.hex.toBits(m.beta);
    var beta = sjcl.mode.ccm.decrypt(aes, b, a);
    return sjcl.codec.utf8String.fromBits(beta);
  }

  certificate_generate(id, signature_key, encryption_key) {
    var res = {};
    res.signature_key = signature_key.public_key.y.toString();
    res.encryption_key = encryption_key.public_key.y.toString();
    var tmp = "certificate|" + id + "|";
    tmp += res.signature_key + "|" + res.encryption_key;
    res.signature = this.signature_sign(signature_key, tmp);
    return res;
  }

  certificate_check(params, id, cert) {
    var tmp = "certificate|" + id + "|";
    tmp += cert.signature_key + "|" + cert.encryption_key;
    var pk = {
      g: params.g,
      p: params.p,
      q: params.q,
      y: new BigInt(cert.signature_key),
    };
    return this.signature_check(pk, tmp, cert.signature);
  }

  // Logging
  ui_logger(id) {
    var main_div = document.getElementById(id);
    var x = document.createElement("pre");
    main_div.appendChild(x);
    return function (s) {
      x.appendChild(document.createTextNode(s + "\n"));
    };
  }

  // Validation of trustee certificates
  ui_validator_check(i) {
    var log = this.log;

    if (i < this.certificates.length) {
      var id = i + 1;
      //log("Checking certificate for trustee #" + id + "...");
      if (this.certificate_check(this.params, id, this.certificates[i])) {
        this.ui_validator_check(i + 1);
      } else {
        console.log("Certificate for trustee #" + id + " failed validation!");
      }
    } else {
      //log("All certificates passed validation!");
      $("#public_key_fingerprint").show();
      $("#input_secret_key").show();
    }
  }

  ui_validator_start() {
    $("#check_certificates_button").hide();
    //this.log = heliosc.ui.logger("check_certificates_log");
    //$("#check_certificates_log").show();
    this.ui_validator_check(0);
  }

  // Loading the secret key
  ui_load_secret_key(next, secretKey) {
    //var secret_key = window.localStorage.getItem("key");
    if (secretKey !== undefined && this.secret_key === undefined) {
      this.secret_key = secretKey;
    }
    var secret_key = this.secret_key;
    if (secret_key === undefined) {
      secret_key = prompt("Please enter your secret key:");
    }

    if (secret_key) {
      try {
        this.trustee = this.trustee_create(this.params, secret_key);
        if (
          !this.trustee.check_certificate(
            this.certificates[this.params.trustee_id - 1]
          )
        ) {
          throw "Not the right key!";
        }
        $("#input_secret_key_button").hide();
        $("#input_secret_key_done").show();
        //window.localStorage.setItem('key', secret_key);
        this.secret_key = secret_key;
        $(next).show();
        return { trustee: this.trustee, key: this.secret_key };
      } catch (e) {
        $("#button-init").attr("disabled", false);
        alert(e);
      }
    }
  };

  // Building the secret share of the election key

  ui_share_trustee(i) {
    var log = this.log;
    if (i < this.params.l) {
      var id = i + 1;
      console.log("Decrypting point shared with trustee #" + id + "...");

      var pk = { g: this.params.g, p: this.params.p, q: this.params.q };
      pk.y = new BigInt(this.certificates[i].signature_key);
      var point = this.trustee.decrypt_point(id, pk, helios_c.points[i]);
      if (point) {
        this.sum = this.sum.add(point).mod(pk.q);

        this.ui_share_trustee(i + 1, helios_c.points);
      } else {
        console.log("Point from trustee #" + id + " is not properly signed!");
      }
    } else {
      console.log("SUCCESS!");
      this.cont();
    }
  }

  ui_share_get_direct() {
    var pk = { g: this.params.g, p: this.params.p, q: this.params.q };
    var SUM = BigInteger.ZERO;
    for (var i = 0; i < this.params.l; i++) {
      var id = i + 1;
      pk.y = new BigInt(this.certificates[i].signature_key);
      var point = this.trustee.decrypt_point(id, pk, this.points[i]);
      if (point) {
        SUM = SUM.add(point).mod(pk.q);
      } else {
        throw "Error while building the secret share of the election key";
      }
    }
    pk.y = this.params.g.modPow(SUM, this.params.p);
    return { x: SUM, public_key: pk };
  }

  ui_share_start(cont) {
    this.cont = cont;
    this.pk = { g: this.params.g, p: this.params.p, q: this.params.q };
    this.ui_share_trustee(0);
  }
}

export let helios_c = new Heliosc();

helios_c.trustee_create = function (PARAMS, seed) {
  var key,
    res = {};

  if (seed) {
    // TODO: check well-formedness of seed
    // actually not needed if check_certificate is called later
    key = sjcl.codec.hex.toBits(seed);
  } else {
    // by default, SJCL generates 256-bit quality random
    key = sjcl.random.randomWords(8);
  }
  var aes = new sjcl.cipher.aes(key);

  function derive(i) {
    // derive 128 (unpredictable, reproducible) random bits from i
    // FIXME: election UUID should also be used
    return sjcl.codec.hex.fromBits(aes.encrypt([0, 0, 0, i]));
  }

  function derive_exponent(i) {
    // derive a mod-q number suitable for use in exponents
    var ii = 2 * i;
    return new BigInt(derive(ii) + derive(ii + 1), 16).mod(PARAMS.q);
  }

  function derive_key(i) {
    var x = derive_exponent(i);
    return {
      x: x,
      public_key: {
        g: PARAMS.g,
        p: PARAMS.p,
        q: PARAMS.q,
        y: PARAMS.g.modPow(x, PARAMS.p),
      },
    };
  }

  var signature_key = derive_key(0);
  var encryption_key = derive_key(1);

  // filled by generate_coefficient below
  var coefficients = [];

  res.get_secret_key = function () {
    sjcl.codec.hex.fromBits(key);
    return sjcl.codec.hex.fromBits(key);
  };

  res.generate_certificate = function () {
    return helios_c.certificate_generate(
      PARAMS.trustee_id,
      signature_key,
      encryption_key
    );
  };

  res.check_certificate = function (cert) {
    return signature_key.public_key.y.toString() == cert.signature_key;
  };

  res.generate_coefficient = function (k) {
    var coefficient = derive_exponent(2 + k);
    coefficients[k] = coefficient;
    var r = PARAMS.g.modPow(coefficient, PARAMS.p).toString();
    var tmp = "coef|" + PARAMS.trustee_id + "|" + k + "|" + r;
    return {
      coefficient: r,
      signature: helios_c.signature_sign(signature_key, tmp),
    };
  };

  res.generate_point = function (j, pk) {
    // here, we assume that all coefficients have been generated

    var point = BigInteger.ZERO;
    var bigj = BigInteger.fromInt(j);
    for (var i = PARAMS.t; i >= 0; i--) {
      point = point.multiply(bigj).add(coefficients[i]).mod(PARAMS.p);
    }
    var res = helios_c.encryption_encrypt(pk, point.toString());
    var tmp = "point|" + PARAMS.trustee_id + "|" + j + "|";
    tmp += res.alpha + "|" + res.beta;
    res.signature = helios_c.signature_sign(signature_key, tmp);
    return res;
  };

  res.check_point = function (i, pk, secret, coefficients) {
    var j = PARAMS.trustee_id;
    // check the signature
    var tmp = "point|" + i + "|" + j + "|";
    tmp += secret.alpha + "|" + secret.beta;
    if (!helios_c.signature_check(pk, tmp, secret.signature)) {
      return false;
    }
    // decrypt and check the point
    var point = helios_c.encryption_decrypt(encryption_key, secret);
    point = PARAMS.g.modPow(new BigInt(point), PARAMS.p);
    var product = BigInteger.ONE;
    var bigj = BigInteger.fromInt(j);
    var jpower = BigInteger.ONE;
    for (var k = 0; k <= PARAMS.t; k++) {
      var c = new BigInt(coefficients[k].coefficient);
      product = product.multiply(c.modPow(jpower, PARAMS.p)).mod(PARAMS.p);
      jpower = jpower.multiply(bigj).mod(PARAMS.q);
    }
    if (product.compareTo(point) != 0) {
      return false;
    }
    // sign an acknowledgement that checks have been done successfully
    tmp += "|ack";
    return helios_c.signature_sign(signature_key, tmp);
  };

  res.check_ack = function (j, pk, secret, ack) {
    var i = PARAMS.trustee_id;
    // check the signature
    var tmp = "point|" + i + "|" + j + "|";
    tmp += secret.alpha + "|" + secret.beta + "|ack";
    return helios_c.signature_check(pk, tmp, ack);
  };

  res.decrypt_point = function (i, pk, secret) {
    // same structure as check_point, but lighter
    var j = PARAMS.trustee_id;
    // check the signature
    var tmp = "point|" + i + "|" + j + "|";
    tmp += secret.alpha + "|" + secret.beta;
    if (!helios_c.signature_check(pk, tmp, secret.signature)) {
      return false;
    }
    // decrypt the point
    var point = helios_c.encryption_decrypt(encryption_key, secret);
    return new BigInt(point);
  };

  return res;
};
