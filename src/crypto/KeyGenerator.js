import { BigInt } from "../static/booth/js/jscrypto/bigint";
import { sjcl } from "../static/booth/js/jscrypto/sjcl";
import { ElGamal } from "../static/booth/js/jscrypto/elgamal";
import { helios_c } from "../static/booth/js/jscrypto/heliosc-trustee";
import { backendOpIP } from "../server";

import { getTrusteeCrypto } from "../services/trustee";
import { getEgParams } from "../services/crypto";

export default class KeyGenerator {
  constructor(shortName, uuidTrustee, { reactFunctions } = {}) {
    this.reactFunctions = reactFunctions;

    this.shortName = shortName;
    this.uuidTrustee = uuidTrustee;
    this.actualStep = 0;
    this.trustee = {};
    this.trusteeCrypto = {};
    this.elGamalParams = {};
    this.secretKey = "";
    this.certificateCache = {};
    this.certificate = {};
    this.trusteeStep = 0;
    this.execute = false;
    this.coefficents = [];
    this.sent = [];
    this.acks = [];
    this.ack2 = [];
    this.interval = null;

    this.derivatorPk = {};

    this.acknowledgerPk = {};

    this.checkAcksPk = {};
  }

  reactFunction(functionName, params) {
    if (functionName in this.reactFunctions) {
      this.reactFunctions[functionName](params);
    }
  }

  initParams() {
    sjcl.random.startCollectors();
    /** Get trustee info */
    getTrusteeCrypto(this.shortName, this.uuidTrustee).then((data) => {
      const trustee = data.jsonResponse.trustee;
      const trustee_crypto = data.jsonResponse.trustee_crypto;
      this.trustee = trustee;
      this.trusteeCrypto = trustee_crypto;
      this.reactFunction("setActualStep", trustee_crypto.current_step);

      /** Set actual step for trustee */
      let eg_params_json = "";
      getEgParams(this.shortName).then((data) => {
        eg_params_json = JSON.parse(data);

        /** Set initial params */
        this.getRandomness().then((data) => {
          const randomness = data;
          sjcl.random.addEntropy(randomness);
          let elgamal_params = ElGamal.Params.fromJSONObject(eg_params_json);

          elgamal_params.trustee_id = trustee_crypto.trustee_election_id;
          helios_c.trustee = helios_c.trustee_create(elgamal_params);
          this.elGamalParams = elgamal_params;
          BigInt.setup(function () {
            elgamal_params = ElGamal.Params.fromJSONObject(eg_params_json);
            elgamal_params.trustee_id = trustee_crypto.trustee_election_id;
            helios_c.trustee = helios_c.trustee_create(elgamal_params);
          });
          this.reactFunction("setEnabledButtonInit", true);
          this.setStepInit(trustee_crypto.current_step);
        });
      });
    });
  }

  derivatorCoeff(i) {
    if (i <= helios_c.params.t) {
      this.coefficents[i] = helios_c.trustee.generate_coefficient(i);
      this.derivatorCoeff(i + 1);
    } else {
      this.derivatorPoint(0);
    }
  }

  derivatorPoint(i) {
    if (i < parseInt(helios_c.params.l)) {
      var id = i + 1;
      this.derivatorPk.y = new BigInt(helios_c.certificates[i].encryption_key);
      helios_c.points[i] = helios_c.trustee.generate_point(
        id,
        this.derivatorPk
      );
      this.derivatorPoint(i + 1);
    } else {
      const coefficients = JSON.stringify(this.coefficents);
      const points = JSON.stringify(helios_c.points);
      this.sendStep(
        1,
        JSON.stringify({ coefficients: coefficients, points: points })
      );
    }
  }

  derivatorStart() {
    this.derivatorPk = {
      g: helios_c.params.g,
      p: helios_c.params.p,
      q: helios_c.params.q,
    };
    this.derivatorCoeff(0);
  }

  acknowledgerTrustee(i) {
    if (i < parseInt(helios_c.params.l)) {
      var id = i + 1;
      var pk = this.acknowledgerPk;
      pk.y = new BigInt(helios_c.certificates[i].signature_key);
      var ack = helios_c.trustee.check_point(
        id,
        pk,
        helios_c.points[i],
        this.coefficents[i]
      );
      if (ack) {
        this.acks[i] = ack;
        this.acknowledgerTrustee(i + 1);
      } else {
        console.log("Points from trustee #" + id + " failed validation!");
      }
    } else {
      this.acknowledgements = JSON.stringify(this.acks);
      const ack = this.acknowledgements;
      this.sendStep(2, JSON.stringify({ acknowledgements: ack }));
    }
  }

  acknowledgerStart() {
    this.acknowledgerPk = {
      g: helios_c.params.g,
      p: helios_c.params.p,
      q: helios_c.params.q,
    };
    this.acknowledgerTrustee(0);
  }

  checkAcksTrustee(i) {
    if (i < parseInt(helios_c.params.l)) {
      var id = i + 1;
      const checkAcksPkAux = this.checkAcksPk;
      const sentAux = this.sent;
      const ack2Aux = this.ack2;
      const checkAcksTrusteeAux = this.checkAcksTrustee;
      setTimeout(function () {
        var pk = checkAcksPkAux;
        pk.y = new BigInt(helios_c.certificates[i].signature_key);
        if (helios_c.trustee.check_ack(id, pk, sentAux[i], ack2Aux[i])) {
          setTimeout(function () {
            checkAcksTrusteeAux(i + 1);
          }, 500);
        } else {
          console.log("Trustee #" + id + " did not acknowledge!");
        }
      }, 500);
    } else {
      console.log("SUCCESS!");
    }
  }

  checkAcksStart() {
    this.checkAcksPk = {
      g: helios_c.params.g,
      p: helios_c.params.p,
      q: helios_c.params.q,
    };
    this.checkAcksTrustee(0);
  }

  async getRandomness() {
    /**
     * async function to get the randomness
     * @returns {int} randomness
     */

    const resp = await fetch(
      backendOpIP + "/" + this.shortName + "/get-randomness",
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (resp.status === 200) {
      const jsonResponse = await resp.json();
      return jsonResponse.randomness;
    }
  }

  async sendStep(step, data) {
    /**
     * async function to send the step
     * @param {int} step to send
     * @param {object} data to send with info about step
     * @returns {object} data response
     */

    const url =
      backendOpIP +
      "/" +
      this.shortName +
      "/trustee/" +
      this.uuidTrustee +
      "/step-" +
      step;

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (resp.status === 200) {
      this.actualStep = this.trusteeStep + 1;
      this.trusteeStep = this.trusteeStep + 1;
      this.execute = false;
      this.reactFunction('setProcessFeedback', "Paso " + step + " completada");
      this.setStepInit(this.trusteeStep);
    } else {
      this.reactFunction('setProcessFeedback', "Error al enviar la etapa " + step);
    }
  }

  async getDataStep(step) {
    /**
     * async function to get the data of the step
     * @param {int} step to get
     * @returns {object} data response
     */

    const url =
      backendOpIP +
      "/" +
      this.shortName +
      "/trustee/" +
      this.uuidTrustee +
      "/" +
      step;

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }

  async getStep() {
    /**
     * async function to get the actual step for trustee
     * @returns {object} data response
     */
    const url =
      backendOpIP +
      "/" +
      this.shortName +
      "/trustee/" +
      this.uuidTrustee +
      "/get-step";

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }

  initProcess() {
    this.trusteeStep = this.trusteeCrypto.current_step;
    this.reactFunction("setEnabledButtonInit", false);
    this.totalProcess();
    this.interval = window.setInterval(() => {
      this.totalProcess();
    }, 5000);
  }

  totalProcess() {
    this.getStep().then((data) => {
      if (this.trusteeStep === data.status) {
        this.actualStep = this.trusteeStep;

        if (this.trusteeStep === 1 && !this.execute) {
          this.reactFunction('setProcessFeedback', `Ejecutando el Paso 2.${this.trusteeStep}`);
          this.execute = true;
          this.step_1();
        } else if (this.trusteeStep === 2 && !this.execute) {
          this.reactFunction('setProcessFeedback', `Ejecutando el Paso 2.${this.trusteeStep}`);
          this.execute = true;
          this.step_2();
        } else if (this.trusteeStep === 3 && !this.execute) {
          this.reactFunction('setProcessFeedback', `Ejecutando el Paso 2.${this.trusteeStep}`);
          this.execute = true;
          this.step_3();
        } else if (this.trusteeStep === 4) {
          window.clearInterval(this.interval);
          this.reactFunction('setProcessFeedback', "Generación de claves completada con éxito");
        }
      } else {
        this.reactFunction('setProcessFeedback', "Los otros trustee aún no completan la etapa");
      }
    });
  }

  step_0() {
    /**
     * Step 0: generate the secret key
     *
     */

    document.getElementById("process_step").style.display = "none";
    this.generateKeyPair();
    this.downloadSkToFile(
      "trustee_key_" +
        this.trustee.trustee_login_id +
        "_" +
        this.shortName +
        ".txt"
    );
    this.reactFunction("setSecretKey", helios_c.secret_key);
    this.reactFunction(
      "setProcessFeedback",
      "Para continuar, debe subir el archivo recién descargado. Recuerde guardar adecuadamente el archivo en su computador y respaldarlo."
    );
  }

  step_1() {
    /**
     * Step 1: generate the certificate
     */
    getEgParams(this.shortName).then((params) => {
      this.getDataStep("step-1").then((data_step) => {
        if ("error" in data_step) {
          this.execute = false;
          this.reactFunction('setProcessFeedback', data_step["error"]);
          return;
        }

        this.getRandomness().then((data_randomnes) => {
          const randomness = data_randomnes;
          sjcl.random.addEntropy(randomness);
          const trusteeCryptoAux = this.trusteeCrypto;
          BigInt.setup(function () {
            helios_c.params = ElGamal.Params.fromJSONObject(JSON.parse(params));
            helios_c.params.trustee_id = trusteeCryptoAux.trustee_election_id;
            helios_c.certificates = JSON.parse(data_step.certificates);
          });

          helios_c.ui_validator_start();
          const loadKey = helios_c.ui_load_secret_key(helios_c.secret_key);
          helios_c.trustee = loadKey.trustee;
          helios_c.secret_key = loadKey.key;
          this.derivatorStart();
        });
      });
    });
  }

  step_2() {
    /**
     * Step 2: generate the coefficients
     */
    getEgParams(this.shortName).then((params) => {
      this.getDataStep("step-2").then((data_step) => {
        if ("error" in data_step) {
          this.execute = false;
          this.reactFunction('setProcessFeedback', data_step["error"]);
          return;
        }
        // get some more server-side randomness for keygen
        this.getRandomness().then((data_randomnes) => {
          const randomness = data_randomnes;
          sjcl.random.addEntropy(randomness);
          let trusteeCryptoAux = this.trusteeCrypto;
          let coefficentsAux = this.coefficents;
          BigInt.setup(function () {
            helios_c.params = ElGamal.Params.fromJSONObject(JSON.parse(params));
            helios_c.params.trustee_id = trusteeCryptoAux.trustee_election_id;
            helios_c.certificates = JSON.parse(data_step.certificates);
            coefficentsAux = JSON.parse(data_step.coefficients);
            helios_c.points = JSON.parse(data_step.points);
          });
          this.coefficents = coefficentsAux;
          helios_c.ui_validator_start();
          const loadKey = helios_c.ui_load_secret_key(helios_c.secret_key);
          helios_c.trustee = loadKey.trustee;
          helios_c.secret_key = loadKey.key;
          this.acknowledgerStart();
        });
      });
    });
  }

  step_3() {
    /**
     * Step 3: generate the points
     */
    getEgParams(this.shortName).then((params) => {
      this.getDataStep("step-3").then((data_step) => {
        if ("error" in data_step) {
          this.execute = false;
          this.reactFunction('setProcessFeedback', data_step["error"]);
          return;
        }
        // get some more server-side randomness for keygen
        this.getRandomness().then((data_randomnes) => {
          const randomness = data_randomnes;
          sjcl.random.addEntropy(randomness);
          let coefficentsAux = this.coefficents;
          let sentAux = this.sent;
          let ack2Aux = this.ack2;
          let trusteeCryptoAux = this.trusteeCrypto;
          BigInt.setup(function () {
            helios_c.params = ElGamal.Params.fromJSONObject(JSON.parse(params));
            helios_c.params.trustee_id = trusteeCryptoAux.trustee_election_id;
            helios_c.certificates = JSON.parse(data_step.certificates);
            coefficentsAux = JSON.parse(data_step.coefficents);
            helios_c.points = JSON.parse(data_step.points);
            sentAux = JSON.parse(data_step.points_sent);
            ack2Aux = JSON.parse(data_step.acks);
          });
          this.coefficents = coefficentsAux;
          this.sent = sentAux;
          this.ack2 = ack2Aux;
          helios_c.ui_validator_start();

          const loadKey = helios_c.ui_load_secret_key(helios_c.secret_key);

          helios_c.trustee = loadKey.trustee;
          helios_c.secret_key = loadKey.key;
          this.checkAcksStart();

          helios_c.ui_share_start(this);
        });
      });
    });
  }

  generateKeyPair() {
    try {
      helios_c.trustee = helios_c.trustee_create(this.elGamalParams);
      this.setupPublicKeyAndProf();
      return true;
    } catch (e) {
      alert(e);
      return false;
    }
  }

  setupPublicKeyAndProf() {
    this.certificate = helios_c.trustee.generate_certificate();
    this.certificateCache = this.certificate;
    helios_c.secret_key = helios_c.trustee.get_secret_key();
    //this.storage.setItem('key', SECRET_KEY);
  }

  downloadSkToFile(filename) {
    var element = document.createElement("a");
    const fileContent = {
      trustee: this.trustee.name,
      private_key: helios_c.secret_key,
    };
    element.setAttribute(
      "href",
      "data:text/plain;charset=utf-8," + JSON.stringify(fileContent)
    );
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  async sendPublicKey() {
    const url =
      backendOpIP +
      "/" +
      this.shortName +
      "/trustee/" +
      this.uuidTrustee +
      "/upload-pk";

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        public_key_json: JSON.stringify(this.certificateCache),
      }),
    });
    if (resp.status === 200) {
      this.trusteeStep = 1;
      this.trusteeCrypto.current_step = 1;
      this.reactFunction("setActualStep", 1);
      this.reactFunction("setActualPhase", 2);
      this.execute = false;
      this.setStepInit(this.trusteeStep);
    }
  }

  setStepInit(step) {
    this.reactFunction("setActualStep", step);
    if (step === 4) {
      this.reactFunction("setActualPhase", 3);
      this.reactFunction("setEnabledButtonInit", false);
      this.reactFunction("setProcessFeedback", "¡Sincronización terminada!");
    } else if (step < 4) {
      if (step !== 0) {
        this.reactFunction("setActualPhase", 2);
        this.reactFunction(
          "setProcessFeedback",
          "Esperando que se complete el proceso"
        );
        //setTextButtonInit("Continuar proceso");
      } else {
        this.reactFunction("setActualPhase", 1);
        this.reactFunction(
          "setProcessFeedback",
          "Clave Privada aún no generada"
        );
      }
    }
  }

  prepareUpload() {
    var pk = {
      g: helios_c.params.g.toString(),
      p: helios_c.params.p.toString(),
      q: helios_c.params.q.toString(),
      y: helios_c.params.g.modPow(helios_c.sum, helios_c.params.p).toString(),
    };
    const verification_key = JSON.stringify(pk);
    this.sendStep(
      3,
      JSON.stringify({
        verification_key: verification_key,
      })
    );
  }

  downloadKey() {
    this.downloadSkToFile(
      "trustee_key_" +
        this.trustee.trustee_login_id +
        "_" +
        this.shortName +
        ".txt"
    );
  }

  checkSk(key) {
    if (key === helios_c.secret_key) {
      this.sendPublicKey();
      this.initProcess();
    } else {
      this.reactFunction('setProcessFeedback', "Archivo incorrecto, inténtelo nuevamente");
    }
  }
}
