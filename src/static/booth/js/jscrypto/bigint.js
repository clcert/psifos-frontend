/*
 * This software incorporates components derived from the
 * Secure Remote Password JavaScript demo developed by
 * Tom Wu (tjw@CS.Stanford.EDU).
 *
 * This library is almost entirely re-written by Ben Adida (ben@adida.net)
 * with a BigInt wrapper.
 *
 * IMPORTANT: this library REQUIRES that a variable JSCRYPTO_HOME be set by an HTML file, indicating
 * the complete path to the current directory
 */

// A wrapper for java.math.BigInteger with some appropriate extra functions for JSON and
// generally being a nice JavaScript object.

// let's try always using SJCL

import { BigInteger } from "./jsbn";

export var USE_SJCL = true;

export var BigInt = null;

// let's make this much cleaner
if (USE_SJCL) {
  // why not?
  BigInt = BigInteger;
  // ZERO AND ONE are already taken care of
  BigInt.TWO = new BigInt("2", 10);

  BigInt.setup = function (callback, fail_callback) {
    // nothing to do but go
    callback();
  };

  BigInt.prototype.toJSONObject = function () {
    return this.toString();
  };
} else {
  BigInt = class BigInt {
    constructor(value, radix) {
      if (value == null) {
        throw new Error("null value!");
      }

      if (USE_SJCL) {
        this._java_bigint = new BigInteger(value, radix);
      } else if (BigInt.use_applet) {
        this._java_bigint = BigInt.APPLET.newBigInteger(value, radix);
      } else {
        try {
          this._java_bigint = BigInt.APPLET.newBigInteger(value, radix);
        } catch (e) {
          // alert("oy " + e.toString() + " value=" + value + " , radix=" + radix);
          throw TypeError;
        }
      }
    }

    toString() {
      return this._java_bigint.toString() + "";
    }

    toJSONObject() {
      return this.toString();
    }

    add(other) {
      return BigInt._from_java_object(
        this._java_bigint.add(other._java_bigint)
      );
    }

    bitLength() {
      return this._java_bigint.bitLength();
    }

    mod(modulus) {
      return BigInt._from_java_object(
        this._java_bigint.mod(modulus._java_bigint)
      );
    }

    equals(other) {
      return this._java_bigint.equals(other._java_bigint);
    }

    modPow(exp, modulus) {
      return BigInt._from_java_object(
        this._java_bigint.modPow(exp._java_bigint, modulus._java_bigint)
      );
    }
    negate() {
      return BigInt._from_java_object(this._java_bigint.negate());
    }

    multiply(other) {
      return BigInt._from_java_object(
        this._java_bigint.multiply(other._java_bigint)
      );
    }

    modInverse(modulus) {
      return BigInt._from_java_object(
        this._java_bigint.modInverse(modulus._java_bigint)
      );
    }
  };

  BigInt.ready_p = false;

  //
  // Some Class Methods
  //
  BigInt._from_java_object = function (jo) {
    // bogus object
    var obj = new BigInt("0", 10);
    obj._java_bigint = jo;
    return obj;
  };

  // Set up the pointer to the applet if necessary, and some
  // basic Big Ints that everyone needs (0, 1, 2, and 42)
  BigInt._setup = function () {
    if (BigInt.use_applet) {
      BigInt.APPLET = document.applets["bigint"];
    }

    try {
      BigInt.ZERO = new BigInt("0", 10);
      BigInt.ONE = new BigInt("1", 10);
      BigInt.TWO = new BigInt("2", 10);
      BigInt.FORTY_TWO = new BigInt("42", 10);

      BigInt.ready_p = true;
    } catch (e) {
      // not ready
      // count how many times we've tried
      if (this.num_invocations == null) this.num_invocations = 0;

      this.num_invocations += 1;

      if (this.num_invocations > 5) {
        // try SJCL
        if (!USE_SJCL) {
          USE_SJCL = true;
          this.num_invocations = 1;
          BigInt.use_applet = false;
        } else {
          if (BigInt.setup_interval)
            window.clearInterval(BigInt.setup_interval);

          if (BigInt.setup_fail) {
            BigInt.setup_fail();
          } else {
            alert("bigint failed!");
          }
        }
      }
      return;
    }

    if (BigInt.setup_interval) window.clearInterval(BigInt.setup_interval);

    if (BigInt.setup_callback) BigInt.setup_callback();
  };

  BigInt.setup = function (callback, fail_callback) {
    if (callback) BigInt.setup_callback = callback;

    if (fail_callback) BigInt.setup_fail = fail_callback;

    BigInt.setup_interval = window.setInterval(BigInt._setup, 1000);
  };
}

BigInt.fromJSONObject = function (s) {
  return new BigInt(s, 10);
};

BigInt.fromInt = function (i) {
  return BigInt.fromJSONObject("" + i);
};

BigInt.use_applet = false;
