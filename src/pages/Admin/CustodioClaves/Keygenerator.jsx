import $ from "jquery";
import { BigInt } from "../../../static/cabina/js/jscrypto/bigint";
import { sjcl } from "../../../static/cabina/js/jscrypto/sjcl";
import { ElGamal } from "../../../static/cabina/js/jscrypto/elgamal";
import { heliosc } from "../../../static/cabina/js/jscrypto/heliosc-trustee";
import ImageFooter from "../../../component/Footers/ImageFooter";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import Title from "../../../component/OthersComponents/Title";
import imageTrustees from "../../../static/svg/trustees1.svg";
import { Link, useParams } from "react-router-dom";
import { backendIP } from "../../../server";
import { useEffect, useState } from "react";

import {
  PARAMS,
  CERTIFICATES,
  POINTS,
  SUM,
} from "../../../static/cabina/js/jscrypto/heliosc-trustee";

function Keygenerator(props) {
  var COEFFICIENTS = [];
  var ACKS = [];
  var SENT, ACKS2;
  var TRUSTEE, CERTIFICATE, SECRET_KEY;
  var ELGAMAL_PARAMS;
  var trustee;
  var process;

  /** @state Trustee   */

  /** @state {string} feedback button (init process) */
  const [textButtonInit, setTextButtonInit] = useState("Iniciar proceso");

  /** @state {bool} enabled statefeedback button (generate keys) */
  const [enabledButtonInit, setEnabledButtonInit] = useState(true);

  /** @state {string} totally process feedback */
  const [processFeedback, setProcessFeedback] = useState("");

  /** @state {int} actual step process */
  const [actualStep, setActualStep] = useState(0);

  const [dataInit, setDataInit] = useState(false);

  /** @urlParam {uuid} election uuid */
  const { uuid, uuidTrustee } = useParams();

  async function getRandomness() {
    /**
     * async function to get the randomness
     * @returns {int} randomness
     */

    const resp = await fetch(backendIP + "/" + uuid + "/get_randomness", {
      method: "GET",
      credentials: "include",
    });
    if (resp.status == 200) {
      const jsonResponse = await resp.json();
      return jsonResponse.randomness;
    }
  }

  async function getTrustee() {
    /**
     * async function to get the trustee
     * set the trustee in the state (params)
     * @returns {object} trustee
     */
    const resp = await fetch(backendIP + "/" + uuidTrustee + "/get_trustee", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (resp.status == 200) {
      const jsonResponse = await resp.json();
      return jsonResponse;
    }
  }

  async function send_step(step, data) {
    /**
     * async function to send the step
     * @param {int} step to send
     * @param {object} data to send with info about step
     * @returns {object} data response
     */

    const url =
      backendIP + "/" + uuid + "/trustee/" + uuidTrustee + "/step" + step;

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      body: data,
    });

    if (resp.status == 200) {
      process.actual_step = process.actual_step + 1;
      process.execute = false;
      set_step_init();
      setProcessFeedback("Etapa " + step + " completada");
    } else {
      setProcessFeedback("Error al enviar la etapa " + step);
    }
  }

  async function get_data_step(step) {
    /**
     * async function to get the data of the step
     * @param {int} step to get
     * @returns {object} data response
     */

    const url =
      backendIP + "/" + uuid + "/trustee/" + uuidTrustee + "/step" + step;

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }

  async function get_step() {
    /**
     * async function to get the actual step for trustee
     * @returns {object} data response
     */
    const url =
      backendIP + "/" + uuid + "/trustee/" + uuidTrustee + "/get_step";

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
   
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }

  async function get_eg_params() {
    /**
     * async function to get the eg params
     * @returns {object} data response
     */
    const url = backendIP + "/" + uuid + "/get_eg_params";

    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
    
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }

  class Steps {
    /**
     * Class steps: is responsible for managing the process of the stages for the generation of keys
     * @param {int} actual_step actual step of the process
     * @param {bool} execute status with process execution
     * @param {object} secret_key secret key
     * @param {object} certificate certificate
     * @param {object} coefficients coefficients
     * @param {object} points points
     * @param {object} acknowledgements acknowledgements
     * @param {object} verification_key verification key
     * @param {object} interval time to ask the server about the process
     *
     */

    constructor() {
      this.actual_step = 0;
      this.execute = false;
      this.secret_key = null;
      this.certificate = null;
      this.coefficients = null;
      this.points = null;
      this.acknowledgements = null;
      this.verification_key = null;
      this.interval = null;
    }

    init_process() {
      this.execute = false;
      this.total_process();
      setEnabledButtonInit(false);
      this.interval = window.setInterval(() => {
        this.total_process();
      }, 1000);
    }

    total_process() {
      get_step();
      if (this.actual_step === 0 && !this.execute) {
        console.log("Step 0");
        this.execute = true;
        this.step_0();
      } else if (this.actual_step === 1 && !this.execute) {
        console.log("Step 1");
        this.execute = true;
        this.step_1();
      } else if (this.actual_step === 2 && !this.execute) {
        console.log("Step 2");
        this.execute = true;
        this.step_2();
      } else if (this.actual_step === 3 && !this.execute) {
        console.log("Step 3");
        this.execute = true;
        this.step_3();
      } else if (this.actual_step === 4) {
        window.clearInterval(this.interval);
        setProcessFeedback("Proceso completado!");
      }
    }

    step_0() {
      /**
       * Step 0: generate the secret key
       *
       */

      console.log("generate key");
      this.generate_keypair();
      console.log("download key");
      this.download_sk_to_file("trustee_key.txt");
      console.log("send key");
      this.send_public_key();
      setProcessFeedback("Proceso de generación de clave privada completado");
    }

    step_1() {
      /**
       * Step 1: generate the certificate
       */

      get_data_step("step1").then((data) => {
        if ("error" in data) {
          this.execute = false;
          setProcessFeedback(data["error"]);
          return;
        }

        getRandomness().then((data) => {
          const randomness = data["randomness"];
          sjcl.random.addEntropy(randomness);
          BigInt.setup(function () {
            PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
            PARAMS.trustee_id = trustee.trustee_id;
            CERTIFICATES = JSON.parse(data["certificates"]);
          });

          heliosc.ui.validator.start();
          heliosc.ui.load_secret_key("#derive");
          derivator.start();
        });
      });
    }

    step_2() {
      /**
       * Step 2: generate the coefficients
       */

      get_data_step("step2").then((data) => {
        if ("error" in data) {
          this.execute = false;
          setProcessFeedback(data["error"]);
          return;
        }
        // get some more server-side randomness for keygen
        getRandomness().then((data) => {
          const randomness = data["randomness"];
          sjcl.random.addEntropy(randomness);
          BigInt.setup(function () {
            PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
            PARAMS.trustee_id = trustee.trustee_id;
            CERTIFICATES = JSON.parse(data["certificates"]);
            COEFFICIENTS = JSON.parse(data["coefficents"]);
            POINTS = JSON.parse(data["points"]);
          });
          heliosc.ui.validator.start();
          heliosc.ui.load_secret_key("#acknowledge");
          acknowledger.start();
        });
      });
    }

    step_3() {
      /**
       * Step 3: generate the points
       */

      get_data_step("step3").then((data) => {
        if ("error" in data) {
          this.execute = false;
          setProcessFeedback(data["error"]);
          return;
        }
        // get some more server-side randomness for keygen
        getRandomness().then((data) => {
          const randomness = data["randomness"];
          sjcl.random.addEntropy(randomness);
          BigInt.setup(function () {
            PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data["params"]));
            PARAMS.trustee_id = trustee.trustee_id;
            CERTIFICATES = JSON.parse(data["certificates"]);
            COEFFICIENTS = JSON.parse(data["coefficents"]);
            POINTS = JSON.parse(data["points"]);
            SENT = JSON.parse(data["points_sent"]);
            ACKS2 = data["acks"];
          });
          heliosc.ui.validator.start();
          heliosc.ui.load_secret_key("#check_acks");
          check_acks.start();
          heliosc.ui.share.start(prepare_upload);
        });
      });
    }

    generate_keypair() {
      try {
        console.log("generate_keypair");
        console.log(ELGAMAL_PARAMS);
        TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
        console.log(TRUSTEE);
        this.setup_public_key_and_proof();
        return true;
      } catch (e) {
        alert(e);
        return false;
      }
    }

    setup_public_key_and_proof() {
      CERTIFICATE = TRUSTEE.generate_certificate();
      SECRET_KEY = TRUSTEE.get_secret_key();
      this.secret_key = SECRET_KEY;
      //this.storage.setItem('key', SECRET_KEY);
      this.certificate = JSON.stringify(CERTIFICATE);
    }

    download_sk_to_file(filename) {
      var element = document.createElement("a");
      element.setAttribute(
        "href",
        "data:text/plain;charset=utf-8," + SECRET_KEY
      );
      element.setAttribute("download", filename);
      element.style.display = "none";
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }

    async send_public_key() {
      let certificate = this.certificate;
      const url =
        backendIP + "/" + uuid + "/trustee/" + uuidTrustee + "/upload_pk";

      const resp = await fetch(url, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          public_key_json: certificate,
        }),
      });

      const jsonResponse = await resp.json();
      this.actual_step = 1;
      this.execute = false;
      set_step_init();
    }
  }

  function prepare_upload() {
    var pk = {
      g: PARAMS.g.toString(),
      p: PARAMS.p.toString(),
      q: PARAMS.q.toString(),
      y: PARAMS.g.modPow(SUM, PARAMS.p).toString(),
    };
    process.verification_key = $.toJSON(pk);
    const verification_key = process.verification_key;
    send_step(
      3,
      JSON.stringify({
        verification_key: verification_key,
      })
    );
  }

  var derivator = {
    coeff: function (i) {
      if (i <= PARAMS.t) {
        setTimeout(function () {
          COEFFICIENTS[i] = TRUSTEE.generate_coefficient(i);
          setTimeout(function () {
            derivator.coeff(i + 1);
          }, 500);
        }, 500);
      } else {
        this.point(0);
      }
    },

    point: function (i) {
      if (i < PARAMS.l) {
        var id = i + 1;
        setTimeout(function () {
          derivator.pk.y = new BigInt(CERTIFICATES[i].encryption_key);
          POINTS[i] = TRUSTEE.generate_point(id, derivator.pk);
          setTimeout(function () {
            derivator.point(i + 1);
          }, 500);
        }, 500);
      } else {
        process.coefficients = $.toJSON(COEFFICIENTS);
        process.points = $.toJSON(POINTS);
        const coefficients = process.coefficients;
        const points = process.points;
        send_step(
          1,
          JSON.stringify({
            coefficients: coefficients,
            points: points,
          })
        );
      }
    },

    start: function () {
      this.pk = { g: PARAMS.g, p: PARAMS.p, q: PARAMS.q };
      this.coeff(0);
    },
  };

  var acknowledger = {
    trustee: function (i) {
      if (i < PARAMS.l) {
        var id = i + 1;
        setTimeout(function () {
          var pk = acknowledger.pk;
          pk.y = new BigInt(CERTIFICATES[i].signature_key);
          var ack = TRUSTEE.check_point(id, pk, POINTS[i], COEFFICIENTS[i]);
          if (ack) {
            ACKS[i] = ack;
            setTimeout(function () {
              acknowledger.trustee(i + 1);
            }, 500);
          } else {
            console.log("Point from trustee #" + id + " failed validation!");
          }
        }, 500);
      } else {
        process.acknowledgements = $.toJSON(ACKS);
        const ack = process.acknowledgements;
        send_step(
          2,
          JSON.stringify({
            acknowledgements: ack,
          })
        );
      }
    },

    start: function () {
      this.pk = { g: PARAMS.g, p: PARAMS.p, q: PARAMS.q };
      this.trustee(0);
    },
  };

  var check_acks = {
    trustee: function (i) {
      if (i < PARAMS.l) {
        var id = i + 1;
        console.log("Checking acknowledgement from trustee #" + id + "...");
        setTimeout(function () {
          var pk = check_acks.pk;
          pk.y = new BigInt(CERTIFICATES[i].signature_key);
          if (TRUSTEE.check_ack(id, pk, SENT[i], ACKS2[i])) {
            setTimeout(function () {
              check_acks.trustee(i + 1);
            }, 500);
          } else {
            console.log("Trustee #" + id + " did not acknowledge!");
          }
        }, 500);
      } else {
        console.log("SUCCESS!");
      }
    },

    start: function () {
      this.pk = { g: PARAMS.g, p: PARAMS.p, q: PARAMS.q };
      this.trustee(0);
    },
  };

  // start collecting some local randomness


  function set_step_init() {
    get_step().then((data) => {
      const step = data["status"];
      process.actual_step = step;
      setActualStep(step);
      if (step > 0) {
        if (step === 4) {
          setEnabledButtonInit(false);
        }
        setTextButtonInit("Continuar proceso");
      }
    });
  }

  useEffect(() => {

    sjcl.random.startCollectors();
    process = new Steps();
    /** Get trustee info */
    getTrustee().then((data) => {
      trustee = data;

      /** Set actual step for trustee */
      set_step_init();
      let eg_params_json = "";
      get_eg_params().then((data) => {
        eg_params_json = data;

        /** Set initial params */
        getRandomness().then((data) => {
          const randomness = data;
          sjcl.random.addEntropy(randomness);
          ELGAMAL_PARAMS = ElGamal.Params.fromJSONObject(eg_params_json);
          ELGAMAL_PARAMS.trustee_id = trustee.trustee_id;
          TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
          BigInt.setup(function () {
            ELGAMAL_PARAMS = ElGamal.Params.fromJSONObject(eg_params_json);
            ELGAMAL_PARAMS.trustee_id = trustee.trustee_id;
            TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
          });
        });
      });
    });
  }, []);

  // get some more server-side randomness for keygen
  // $.getJSON("../../get-randomness", function (result) {
  //   sjcl.random.addEntropy(result.randomness);
  //   BigInt.setup(function () {
  //     ELGAMAL_PARAMS = ElGamal.Params.fromJSONObject("{{eg_params_json|safe}}");
  //     ELGAMAL_PARAMS.trustee_id = "{{trustee.trustee_id}}";
  //     TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
  //   });
  // });

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            adressExit={backendIP + "/" + uuid + "/trustee" + "/logout"}
          />
          <Title
            namePage="Custodio de Claves"
            nameElection={"Pagina privada de Vocal"}
          />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          <div className="level">
            <div className="level-item has-text-centered">
              <div>
                <p className="pb-2 title has-text-white">
                  Generación claves{" "}
                  <i
                    id="step_0"
                    className={
                      actualStep >= 1
                        ? "fa-solid fa-circle-check"
                        : "fa-solid fa-circle-xmark"
                    }
                  ></i>
                </p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="pb-2 title has-text-white">
                  Etapa 1{" "}
                  <i
                    id="step_1"
                    className={
                      actualStep >= 2
                        ? "fa-solid fa-circle-check"
                        : "fa-solid fa-circle-xmark"
                    }
                  ></i>
                </p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="pb-2 title has-text-white">
                  Etapa 2{" "}
                  <i
                    id="step_2"
                    className={
                      actualStep >= 3
                        ? "fa-solid fa-circle-check"
                        : "fa-solid fa-circle-xmark"
                    }
                  ></i>
                </p>
              </div>
            </div>
            <div className="level-item has-text-centered">
              <div>
                <p className="pb-2 title has-text-white">
                  Etapa 3{" "}
                  <i
                    id="step_3"
                    className={
                      actualStep >= 4
                        ? "fa-solid fa-circle-check"
                        : "fa-solid fa-circle-xmark"
                    }
                  ></i>
                </p>
              </div>
            </div>
          </div>
          <div id="process_step" className="has-text-white">
            {processFeedback}
          </div>
          <br />
          <button id="button-init" className="button is-link mr-5">
            <Link
              style={{ textDecoration: "None", color: "white" }}
              to={"/" + uuid + "/trustee/" + uuidTrustee + "/home"}
            >
              Volver atrás
            </Link>
          </button>
          <button
            id="button-init"
            className="button is-link mr-5"
            disabled={!enabledButtonInit}
            onClick={() => {
              process.init_process();
            }}
          >
            {textButtonInit}
          </button>
        </div>
      </section>
      <div>
        <ImageFooter imagePath={imageTrustees} />
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
      </div>
    </div>
  );
}

export default Keygenerator;
