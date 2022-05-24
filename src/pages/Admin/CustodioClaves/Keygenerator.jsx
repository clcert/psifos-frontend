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
  var TRUSTEE, CERTIFICATE, SECRET_KEY, PARAMS;
  var ELGAMAL_PARAMS;
  var ACTUAL_STEP = 0;
  var TRUSTEE_AUX;
  var CERTIFICATES;
  var POINTS_AUX = [];
  var EXECUTE = false;
  var ACKNOWLEDGEMENTS;
  var VERIFICATION_KEY;
  var TRUSTEE_STEP;

  /** @state Trustee   */

  /** @state {string} feedback button (init process) */
  const [textButtonInit, setTextButtonInit] = useState("Iniciar proceso");

  /** @state {bool} enabled statefeedback button (generate keys) */
  const [enabledButtonInit, setEnabledButtonInit] = useState(false);

  /** @state {string} totally process feedback */
  const [processFeedback, setProcessFeedback] = useState("Cargando datos..");

  const [actualStep, setActualStep] = useState(0);

  const [trustee, setTrustee] = useState("");

  const [interval, setInterval] = useState(null);

  const [ElGamalParams, setElGamalParams] = useState("");

  /** @urlParam {uuid} election uuid */
  const { uuid, uuidTrustee } = useParams();

  useEffect(() => {
    sjcl.random.startCollectors();
    /** Get trustee info */
    getTrustee().then((data) => {
      TRUSTEE_AUX = data;
      TRUSTEE_STEP = data.current_step;
      setActualStep(TRUSTEE_STEP);
      setTrustee(data);
      /** Set actual step for trustee */
      let eg_params_json = "";
      get_eg_params().then((data) => {
        eg_params_json = data;

        /** Set initial params */
        getRandomness().then((data) => {
          const randomness = data;
          sjcl.random.addEntropy(randomness);
          ELGAMAL_PARAMS = ElGamal.Params.fromJSONObject(eg_params_json);

          ELGAMAL_PARAMS.trustee_id = TRUSTEE_AUX.trustee_id;
          TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
          setElGamalParams(ELGAMAL_PARAMS);
          BigInt.setup(function () {
            ELGAMAL_PARAMS = ElGamal.Params.fromJSONObject(eg_params_json);
            ELGAMAL_PARAMS.trustee_id = TRUSTEE_AUX.trustee_id;
            TRUSTEE = heliosc.trustee(ELGAMAL_PARAMS);
          });
          setEnabledButtonInit(true);
          set_step_init(TRUSTEE_STEP);
        });
      });
    });
  }, []);

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

    const url = "/" + uuid + "/trustee/" + uuidTrustee + "/step" + step;

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: data,
    });

    if (resp.status == 200) {
      setActualStep(TRUSTEE_STEP + 1);
      setProcessFeedback("Paso " + step + " completada");
      TRUSTEE_STEP = TRUSTEE_STEP + 1;
      EXECUTE = false;
      set_step_init();
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

    const url = backendIP + "/" + uuid + "/trustee/" + uuidTrustee + "/" + step;

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

  function init_process() {
    TRUSTEE_STEP = trustee.current_step;
    setEnabledButtonInit(false);
    total_process();
    setInterval(
      window.setInterval(() => {
        total_process();
      }, 5000)
    );
  }

  function total_process() {
    get_step().then((data) => {
      console.log(TRUSTEE_STEP);
      console.log(data.status);
      if (TRUSTEE_STEP === data.status) {
        ACTUAL_STEP = data.status;
        setActualStep(ACTUAL_STEP);
        console.log("ACTUAL_STEP: " + ACTUAL_STEP);
        if (ACTUAL_STEP === 0 && !EXECUTE) {
          console.log("Step 0");
          EXECUTE = true;
          step_0();
        } else if (ACTUAL_STEP === 1 && !EXECUTE) {
          console.log("Step 1");
          EXECUTE = true;
          step_1();
        } else if (ACTUAL_STEP === 2 && !EXECUTE) {
          console.log("Step 2");
          EXECUTE = true;
          step_2();
        } else if (ACTUAL_STEP === 3 && !EXECUTE) {
          console.log("Step 3");
          EXECUTE = true;
          step_3();
        } else if (ACTUAL_STEP === 4) {
          window.clearInterval(interval);
          setProcessFeedback("Proceso completado!");
        }
      } else {
        setProcessFeedback("Los otros trustee aun no completan la etapa");
      }
    });
  }

  function step_0() {
    /**
     * Step 0: generate the secret key
     *
     */

    console.log("generate key");
    generate_keypair();
    console.log("download key");
    download_sk_to_file("trustee_key.txt");
    console.log("send key");
    send_public_key();
    setProcessFeedback("Proceso de generación de clave privada completado");
  }

  function step_1() {
    /**
     * Step 1: generate the certificate
     */

    get_data_step("step1").then((data_step) => {
      if ("error" in data_step) {
        EXECUTE = false;
        setProcessFeedback(data_step["error"]);
        return;
      }

      getRandomness().then((data_randomnes) => {
        const randomness = data_randomnes;
        sjcl.random.addEntropy(randomness);

        BigInt.setup(function () {
          PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data_step.params));
          PARAMS.trustee_id = trustee.trustee_id;
          CERTIFICATES = JSON.parse(data_step.certificates);
        });

        heliosc.ui.validator.start(CERTIFICATES, SECRET_KEY, PARAMS);
        TRUSTEE = heliosc.ui.load_secret_key("#acknowledge", SECRET_KEY);
        derivator.start(CERTIFICATES, TRUSTEE);
      });
    });
  }

  function step_2() {
    /**
     * Step 2: generate the coefficients
     */

    get_data_step("step2").then((data_step) => {
      if ("error" in data_step) {
        EXECUTE = false;
        setProcessFeedback(data_step["error"]);
        return;
      }
      // get some more server-side randomness for keygen
      getRandomness().then((data_randomnes) => {
        const randomness = data_randomnes;
        sjcl.random.addEntropy(randomness);
        BigInt.setup(function () {
          PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data_step.params));
          PARAMS.trustee_id = trustee.trustee_id;
          CERTIFICATES = JSON.parse(data_step.certificates);
          COEFFICIENTS = JSON.parse(data_step.coefficients);
          POINTS_AUX = JSON.parse(data_step.points);
        });
        heliosc.ui.validator.start(CERTIFICATES, SECRET_KEY, PARAMS);
        TRUSTEE = heliosc.ui.load_secret_key("#acknowledge", SECRET_KEY);
        acknowledger.start(POINTS_AUX, COEFFICIENTS, TRUSTEE);
      });
    });
  }

  function step_3() {
    /**
     * Step 3: generate the points
     */

    get_data_step("step3").then((data_step) => {
      if ("error" in data_step) {
        EXECUTE = false;
        setProcessFeedback(data_step["error"]);
        return;
      }
      // get some more server-side randomness for keygen
      getRandomness().then((data_randomnes) => {
        const randomness = data_randomnes;
        sjcl.random.addEntropy(randomness);
        BigInt.setup(function () {
          PARAMS = ElGamal.Params.fromJSONObject(JSON.parse(data_step.params));
          PARAMS.trustee_id = trustee.trustee_id;
          CERTIFICATES = JSON.parse(data_step.certificates);
          COEFFICIENTS = JSON.parse(data_step.coefficents);
          POINTS_AUX = JSON.parse(data_step.points);
          SENT = JSON.parse(data_step.points_sent);
          ACKS2 = JSON.parse(data_step.acks);
        });
        heliosc.ui.validator.start(CERTIFICATES, SECRET_KEY, PARAMS);
        TRUSTEE = heliosc.ui.load_secret_key("#check_acks");
        check_acks.start();

        heliosc.ui.share.start(
          prepare_upload,
          CERTIFICATES,
          POINTS_AUX,
          PARAMS
        );
      });
    });
  }

  function generate_keypair() {
    try {
      TRUSTEE = heliosc.trustee(ElGamalParams);
      setup_public_key_and_proof();
      return true;
    } catch (e) {
      alert(e);
      return false;
    }
  }

  function setup_public_key_and_proof() {
    CERTIFICATE = TRUSTEE.generate_certificate();
    SECRET_KEY = TRUSTEE.get_secret_key();
    //this.storage.setItem('key', SECRET_KEY);
  }

  function download_sk_to_file(filename) {
    var element = document.createElement("a");
    element.setAttribute("href", "data:text/plain;charset=utf-8," + SECRET_KEY);
    element.setAttribute("download", filename);
    element.style.display = "none";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  }

  async function send_public_key() {
    const url = "/" + uuid + "/trustee/" + uuidTrustee + "/upload_pk";

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        public_key_json: JSON.stringify(CERTIFICATE),
      }),
    });

    const jsonResponse = await resp.json();
    ACTUAL_STEP = 1;
    TRUSTEE_STEP = 1;
    setActualStep(1);
    EXECUTE = false;
    set_step_init();
  }

  function set_step_init() {
    console.log(TRUSTEE_STEP);
    if (TRUSTEE_STEP > 0) {
      if (TRUSTEE_STEP === 4) {
        setEnabledButtonInit(false);
        setProcessFeedback("Proceso terminado!");
      } else {
        setTextButtonInit("Continuar proceso");
        setProcessFeedback(`Actualmente se esta en la etapa ${TRUSTEE_STEP}`);
      }
    }
  }

  function prepare_upload() {
    var pk = {
      g: PARAMS.g.toString(),
      p: PARAMS.p.toString(),
      q: PARAMS.q.toString(),
      y: PARAMS.g.modPow(SUM, PARAMS.p).toString(),
    };
    VERIFICATION_KEY = JSON.stringify(pk);
    const verification_key = VERIFICATION_KEY;
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
      if (i < parseInt(PARAMS.l)) {
        var id = i + 1;
        setTimeout(function () {
          derivator.pk.y = new BigInt(CERTIFICATES[i].encryption_key);
          POINTS_AUX[i] = TRUSTEE.generate_point(id, derivator.pk);
          setTimeout(function () {
            derivator.point(i + 1);
          }, 500);
        }, 500);
      } else {
        const coefficients = JSON.stringify(COEFFICIENTS);
        const points = JSON.stringify(POINTS_AUX);
        send_step(
          1,
          JSON.stringify({
            coefficients: coefficients,
            points: points,
          })
        );
      }
    },

    start: function (CERTIFICATES) {
      CERTIFICATES = CERTIFICATES;
      this.pk = { g: PARAMS.g, p: PARAMS.p, q: PARAMS.q };
      this.coeff(0);
    },
  };

  var acknowledger = {
    trustee: function (i) {
      if (i < parseInt(PARAMS.l)) {
        var id = i + 1;
        setTimeout(function () {
          var pk = acknowledger.pk;
          pk.y = new BigInt(CERTIFICATES[i].signature_key);
          var ack = TRUSTEE.check_point(id, pk, POINTS_AUX[i], COEFFICIENTS[i]);
          if (ack) {
            ACKS[i] = ack;
            setTimeout(function () {
              acknowledger.trustee(i + 1);
            }, 500);
          } else {
            console.log("Points from trustee #" + id + " failed validation!");
          }
        }, 500);
      } else {
        ACKNOWLEDGEMENTS = JSON.stringify(ACKS);
        const ack = ACKNOWLEDGEMENTS;
        send_step(
          2,
          JSON.stringify({
            acknowledgements: ack,
          })
        );
      }
    },
    start: function (points, coefficents) {
      POINTS_AUX = points;
      COEFFICIENTS = coefficents;
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
            nameElection={"Paso 1: Generación de Claves " + trustee.name}
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
                  Paso 1{" "}
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
                  Paso 2{" "}
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
                  Paso 3{" "}
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
              init_process();
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
