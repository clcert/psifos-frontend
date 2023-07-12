import { BigInt } from "../../../static/booth/js/jscrypto/bigint";
import { sjcl } from "../../../static/booth/js/jscrypto/sjcl";
import { ElGamal } from "../../../static/booth/js/jscrypto/elgamal";
import { helios_c } from "../../../static/booth/js/jscrypto/heliosc-trustee";
import ImageFooter from "../../../component/Footers/ImageFooter";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import imageTrustees from "../../../static/svg/trustees1.svg";
import DropFile from "./components/DropFile";
import { Link, useParams } from "react-router-dom";
import { backendOpIP } from "../../../server";
import { useCallback, useEffect, useState } from "react";

import { getTrusteeHome } from "../../../services/trustee";
import { getEgParams } from "../../../services/crypto";

function Keygenerator(props) {
  let COEFFICIENTS = [];
  let ACKS = [];
  let SENT, ACKS2;
  let CERTIFICATE;
  let EXECUTE = false;
  let ACKNOWLEDGEMENTS;
  let TRUSTEE_STEP = 0;

  /** @state Trustee   */

  /** @state {string} feedback button (init process) */
  const [textButtonInit, setTextButtonInit] = useState("Iniciar proceso");

  /** @state {bool} enabled statefeedback button (generate keys) */
  const [enabledButtonInit, setEnabledButtonInit] = useState(false);

  /** @state {string} totally process feedback */
  const [processFeedback, setProcessFeedback] = useState("Cargando datos..");

  const [actualStep, setActualStep] = useState(0);

  const [trustee, setTrustee] = useState("");

  const [election, setElection] = useState([]);

  const [interval, setInterval] = useState(null);

  const [ElGamalParams, setElGamalParams] = useState("");

  const [actualPhase, setActualPhase] = useState(null);

  const [secretKey, setSecretKey] = useState(null);

  const [certificateCache, setCertificateCache] = useState(null);

  const [checkedSecretKey, setCheckedSecretKey] = useState("");

  /** @urlParam {shortName} election shortName */
  const { shortName, uuidTrustee } = useParams();

  const getRandomness = useCallback(async () => {
    /**
     * async function to get the randomness
     * @returns {int} randomness
     */

    const resp = await fetch(
      backendOpIP + "/" + shortName + "/get-randomness",
      {
        method: "GET",
        credentials: "include",
      }
    );
    if (resp.status === 200) {
      const jsonResponse = await resp.json();
      return jsonResponse.randomness;
    }
  }, [shortName]);

  useEffect(() => {
    sjcl.random.startCollectors();
    /** Get trustee info */
    getTrusteeHome(shortName, uuidTrustee).then((data) => {
      const trustee_aux = data.jsonResponse.trustee;
      setActualStep(trustee_aux.current_step);
      setTrustee(trustee_aux);
      /** Set actual step for trustee */
      let eg_params_json = "";
      getEgParams(shortName).then((data) => {
        eg_params_json = JSON.parse(data);

        /** Set initial params */
        getRandomness().then((data) => {
          const randomness = data;
          sjcl.random.addEntropy(randomness);
          let elgamal_params = ElGamal.Params.fromJSONObject(eg_params_json);

          elgamal_params.trustee_id = trustee_aux.trustee_id;
          helios_c.trustee = helios_c.trustee_create(elgamal_params);
          setElGamalParams(elgamal_params);
          BigInt.setup(function () {
            elgamal_params = ElGamal.Params.fromJSONObject(eg_params_json);
            elgamal_params.trustee_id = trustee_aux.trustee_id;
            helios_c.trustee = helios_c.trustee_create(elgamal_params);
          });
          setEnabledButtonInit(true);
          set_step_init(trustee_aux.current_step);
        });
      });
    });
  }, [shortName, uuidTrustee, getRandomness]);

  async function send_step(step, data) {
    /**
     * async function to send the step
     * @param {int} step to send
     * @param {object} data to send with info about step
     * @returns {object} data response
     */

    const url =
      backendOpIP +
      "/" +
      shortName +
      "/trustee/" +
      uuidTrustee +
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
      setActualStep(TRUSTEE_STEP + 1);
      setProcessFeedback("Paso " + step + " completada");
      TRUSTEE_STEP = TRUSTEE_STEP + 1;
      EXECUTE = false;
      set_step_init(TRUSTEE_STEP);
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
      backendOpIP + "/" + shortName + "/trustee/" + uuidTrustee + "/" + step;

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
      backendOpIP + "/" + shortName + "/trustee/" + uuidTrustee + "/get-step";

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
      console.log(TRUSTEE_STEP, data.status);
      if (TRUSTEE_STEP === data.status) {
        setActualStep(TRUSTEE_STEP);

        if (TRUSTEE_STEP === 1 && !EXECUTE) {
          setProcessFeedback(`Ejecutando el paso ${TRUSTEE_STEP}`);
          EXECUTE = true;
          step_1();
        } else if (TRUSTEE_STEP === 2 && !EXECUTE) {
          setProcessFeedback(`Ejecutando el paso ${TRUSTEE_STEP}`);
          EXECUTE = true;
          step_2();
        } else if (TRUSTEE_STEP === 3 && !EXECUTE) {
          setProcessFeedback(`Ejecutando el paso ${TRUSTEE_STEP}`);
          EXECUTE = true;
          step_3();
        } else if (TRUSTEE_STEP === 4) {
          window.clearInterval(interval);
          setProcessFeedback("Generación de claves completada con éxito");
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

    document.getElementById("process_step").style.display = "none";
    generate_keypair();
    download_sk_to_file("trustee_key_" + trustee.trustee_login_id + "_" + shortName + ".txt");
    setSecretKey(helios_c.secret_key);
    setProcessFeedback(
      "Para continuar, debe subir el archivo recién descargado. Recuerde guardar adecuadamente el archivo en su computador y respaldarlo."
    );
  }

  function step_1() {
    /**
     * Step 1: generate the certificate
     */
    getEgParams(shortName).then((params) => {
      get_data_step("step-1").then((data_step) => {
        if ("error" in data_step) {
          EXECUTE = false;
          setProcessFeedback(data_step["error"]);
          return;
        }

        getRandomness().then((data_randomnes) => {
          const randomness = data_randomnes;
          sjcl.random.addEntropy(randomness);

          BigInt.setup(function () {
            helios_c.params = ElGamal.Params.fromJSONObject(JSON.parse(params));
            helios_c.params.trustee_id = trustee.trustee_id;
            helios_c.certificates = JSON.parse(data_step.certificates);
          });

          helios_c.ui_validator_start();
          const loadKey = helios_c.ui_load_secret_key(helios_c.secret_key);
          helios_c.trustee = loadKey.trustee;
          helios_c.secret_key = loadKey.key;
          derivator.start();
        });
      });
    });
  }

  function step_2() {
    /**
     * Step 2: generate the coefficients
     */
    getEgParams(shortName).then((params) => {
      get_data_step("step-2").then((data_step) => {
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
            helios_c.params = ElGamal.Params.fromJSONObject(JSON.parse(params));
            helios_c.params.trustee_id = trustee.trustee_id;
            helios_c.certificates = JSON.parse(data_step.certificates);
            COEFFICIENTS = JSON.parse(data_step.coefficients);
            helios_c.points = JSON.parse(data_step.points);
          });
          helios_c.ui_validator_start();
          const loadKey = helios_c.ui_load_secret_key(helios_c.secret_key);
          helios_c.trustee = loadKey.trustee;
          helios_c.secret_key = loadKey.key;
          acknowledger.start();
        });
      });
    });
  }

  function step_3() {
    /**
     * Step 3: generate the points
     */
    getEgParams(shortName).then((params) => {
      get_data_step("step-3").then((data_step) => {
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
            helios_c.params = ElGamal.Params.fromJSONObject(JSON.parse(params));
            helios_c.params.trustee_id = trustee.trustee_id;
            helios_c.certificates = JSON.parse(data_step.certificates);
            COEFFICIENTS = JSON.parse(data_step.coefficents);
            helios_c.points = JSON.parse(data_step.points);
            SENT = JSON.parse(data_step.points_sent);
            ACKS2 = JSON.parse(data_step.acks);
          });
          helios_c.ui_validator_start();

          const loadKey = helios_c.ui_load_secret_key(helios_c.secret_key);

          helios_c.trustee = loadKey.trustee;
          helios_c.secret_key = loadKey.key;
          check_acks.start();

          helios_c.ui_share_start(prepare_upload);
        });
      });
    });
  }

  function generate_keypair() {
    try {
      helios_c.trustee = helios_c.trustee_create(ElGamalParams);
      setup_public_key_and_proof();
      return true;
    } catch (e) {
      alert(e);
      return false;
    }
  }

  function setup_public_key_and_proof() {
    CERTIFICATE = helios_c.trustee.generate_certificate();
    setCertificateCache(CERTIFICATE);
    helios_c.secret_key = helios_c.trustee.get_secret_key();
    //this.storage.setItem('key', SECRET_KEY);
  }

  function download_sk_to_file(filename) {
    var element = document.createElement("a");
    const fileContent = {
      trustee: trustee.name,
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

  async function send_public_key() {
    const url =
      backendOpIP + "/" + shortName + "/trustee/" + uuidTrustee + "/upload-pk";

    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        public_key_json: JSON.stringify(certificateCache),
      }),
    });
    if (resp.status === 200) {
      TRUSTEE_STEP = 1;
      trustee.current_step = 1;
      setActualStep(1);
      setActualPhase(2);
      EXECUTE = false;
      set_step_init(TRUSTEE_STEP);
    }
  }

  function set_step_init(step) {
    setActualStep(step);
    if (step === 4) {
      setActualPhase(2);
      setEnabledButtonInit(false);
      setProcessFeedback("¡Sincronización terminada!");
    } else if (step < 4) {
      if (step !== 0) {
        setActualPhase(2);
        setProcessFeedback("Esperando que se complete el proceso");
        setTextButtonInit("Continuar proceso");
      } else {
        setActualPhase(1);
        setProcessFeedback("Clave aun no generada");
      }
    }
  }

  function prepare_upload() {
    var pk = {
      g: helios_c.params.g.toString(),
      p: helios_c.params.p.toString(),
      q: helios_c.params.q.toString(),
      y: helios_c.params.g.modPow(helios_c.sum, helios_c.params.p).toString(),
    };
    const verification_key = JSON.stringify(pk);
    send_step(
      3,
      JSON.stringify({
        verification_key: verification_key,
      })
    );
  }

  var derivator = {
    coeff: function (i) {
      if (i <= helios_c.params.t) {
        COEFFICIENTS[i] = helios_c.trustee.generate_coefficient(i);
        derivator.coeff(i + 1);
      } else {
        this.point(0);
      }
    },

    point: function (i) {
      if (i < parseInt(helios_c.params.l)) {
        var id = i + 1;
        derivator.pk.y = new BigInt(helios_c.certificates[i].encryption_key);
        helios_c.points[i] = helios_c.trustee.generate_point(id, derivator.pk);
        derivator.point(i + 1);
      } else {
        const coefficients = JSON.stringify(COEFFICIENTS);
        const points = JSON.stringify(helios_c.points);
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
      this.pk = {
        g: helios_c.params.g,
        p: helios_c.params.p,
        q: helios_c.params.q,
      };
      this.coeff(0);
    },
  };

  var acknowledger = {
    trustee: function (i) {
      if (i < parseInt(helios_c.params.l)) {
        var id = i + 1;

        var pk = acknowledger.pk;
        pk.y = new BigInt(helios_c.certificates[i].signature_key);
        var ack = helios_c.trustee.check_point(
          id,
          pk,
          helios_c.points[i],
          COEFFICIENTS[i]
        );
        if (ack) {
          ACKS[i] = ack;
          acknowledger.trustee(i + 1);
        } else {
          console.log("Points from trustee #" + id + " failed validation!");
        }
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
    start: function () {
      this.pk = {
        g: helios_c.params.g,
        p: helios_c.params.p,
        q: helios_c.params.q,
      };
      this.trustee(0);
    },
  };

  var check_acks = {
    trustee: function (i) {
      if (i < helios_c.params.l) {
        var id = i + 1;
        console.log("Checking acknowledgement from trustee #" + id + "...");
        setTimeout(function () {
          var pk = check_acks.pk;
          pk.y = new BigInt(helios_c.certificates[i].signature_key);
          if (helios_c.trustee.check_ack(id, pk, SENT[i], ACKS2[i])) {
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
      this.pk = {
        g: helios_c.params.g,
        p: helios_c.params.p,
        q: helios_c.params.q,
      };
      this.trustee(0);
    },
  };

  const downloadKey = () => {
    download_sk_to_file("trustee_key_" + trustee.trustee_login_id + "_" + shortName + ".txt");
  };

  const checkSk = (key) => {
    if (key === helios_c.secret_key) {
      send_public_key();
      init_process();
    } else {
      setProcessFeedback("Archivo incorrecto, inténtelo nuevamente");
    }
  };

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            linkExit={`${backendOpIP}/${shortName}/trustee/logout`}
            linkInit={"/" + shortName + "/trustee/" + uuidTrustee + "/home"}
          />
          <TitlePsifos
            namePage="Portal de Custodio de Clave: Generación"
            nameElection={election.name} // TODO: Retrieve this value
          />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          {actualPhase === 1 && (
            <div className="level-item has-text-centered">
              <div>
                <p className="pb-2 title has-text-white">
                  Generación de Claves{" "}
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
          )}
          {actualPhase === 2 && (
            <div>
              <p className="title has-text-white pb-2">
                Sincronizando con los otros custodios de claves{" "}
                <i
                  id="step_1"
                  className={
                    actualStep >= 4
                      ? "fa-solid fa-circle-check"
                      : "fa-solid fa-spinner fa-spin"
                  }
                ></i>
              </p>
            </div>

            /*          <div className="level">
              <div className="level-item has-text-centered">
                <div>
                  <p className="pb-2 title has-text-white">
                    Paso 1{" "}
                    <i
                      id="step_1"
                      className={
                        actualStep >= 2
                          ? "fa-solid fa-circle-check"
                          : "fa-solid fa-spinner fa-spin"
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
                          : "fa-solid fa-spinner fa-spin"
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
                          : "fa-solid fa-spinner fa-spin"
                      }
                    ></i>
                  </p>
                </div>
              </div>
            </div> */
          )}
          <div
            id="process_step"
            className="mt-3 has-text-black is-size-5 px-6 box"
          >
            <span>
              &nbsp;
              <i className="fa-solid fa-circle-info"></i>&nbsp;INFORMACIÓN
              <br />
              Una vez que descargue la clave, debe almacenarla en su
              computador y respaldar el archivo descargado. Puede respaldar guardando
              el archivo en un pendrive.
            </span>
          </div>
          <br />
          <p id="feedback-message" className="has-text-white is-size-5">
            {processFeedback}
          </p>
          {secretKey && actualPhase === 1 && <DropFile setText={checkSk} />}

          <div className="d-flex flex-sm-column mt-4 is-align-items-center">
            {!secretKey && actualPhase === 1 && (
              <button
                id="download-key"
                className="is-large button is-info is-light is-outlined"
                style={{
                  textDecoration: "None",
                  textTransform: "uppercase",
                  whiteSpace: "normal",
                  height: "3em",
                }}
                disabled={!enabledButtonInit}
                onClick={() => {
                  step_0();
                }}
              >
                Generar y descargar clave
              </button>
            )}
            {actualPhase === 2 && actualStep !== 4 && (
              <button
                className="button mx-sm-2 mt-2"
                disabled={!enabledButtonInit}
                onClick={() => {
                  init_process();
                }}
              >
                {textButtonInit}
              </button>
            )}
            {actualStep === 4 && (
              <div>
                {/* <p className="has-text-white mb-1 is-size-5 px-5">Para terminar el proceso, es necesario que verifiques nuevamente la clave privada que guardaste en tu computador</p> */}
                <button id="button-init" className="button is-link mr-5 mt-0">
                  <Link
                    id="go-home-trustee"
                    style={{ textDecoration: "None", color: "white" }}
                    to={
                      "/psifos/" +
                      shortName +
                      "/trustee/" +
                      uuidTrustee +
                      "/home"
                    }
                  >
                    Ir al Home
                  </Link>
                </button>
              </div>
            )}
          </div>
          <div className="d-flex justify-content-center flex-sm-row flex-column-reverse">
            {secretKey && actualPhase === 1 && (
              <div>
                <p className="has-text-white is-size-5 mb-1 mt-4">
                  Si no encuentra el archivo, puede descargarlo nuevamente.
                </p>
                <button
                  className="button is-primary mt-0"
                  onClick={() => {
                    downloadKey();
                  }}
                >
                  Descargar clave
                </button>
              </div>
            )}
          </div>
          {actualStep !== 4 && (
            <button className="button is-normal is-link mt-5">
              <Link
                id="go-home-trustee"
                style={{ textDecoration: "None", color: "white" }}
                to={
                  "/psifos/" + shortName + "/trustee/" + uuidTrustee + "/home"
                }
              >
                Volver atrás
              </Link>
            </button>
          )}
        </div>
      </section>
      <div>
        <ImageFooter imagePath={imageTrustees} />
        <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
      </div>
    </div>
  );
}

export default Keygenerator;
