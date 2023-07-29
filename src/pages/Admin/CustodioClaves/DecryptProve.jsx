import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { backendOpIP } from "../../../server";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import imageTrustees from "../../../static/svg/trustees2.svg";
import { getEgParams } from "../../../services/crypto";
import DropFile from "./components/DropFile";
import ModalDecrypt from "./components/ModalDecrypt";

function DecryptProve() {
  const [actualStep, setActualStep] = useState(0);
  const [secretKey, setSecretKey] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Esperando clave para generar desencriptado parcial"
  );

  const { shortName, uuidTrustee } = useParams();

  let PARAMS;
  let CERTIFICATES;
  let POINTS;
  let ELECTION;
  let TRUSTEE;
  let DESCRIPTIONS = [];
  let WORKERS = [];
  let RESULT_WORKERS = [];
  let WORKERS_QUESTIONS = [];
  const TOTAL_WORKERS = Math.max(navigator.hardwareConcurrency, 4);
  let QUESTIONS_COMPLETE = 0;
  let TOTAL_TALLY;

  const getDecrypt = useCallback(async () => {
    const url =
      backendOpIP +
      "/" +
      shortName +
      "/trustee/" +
      uuidTrustee +
      "/decrypt-and-prove";
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  }, [shortName, uuidTrustee]);

  async function sendDecrypt(descriptions) {
    setFeedbackMessage("Enviando información...");
    const url =
      backendOpIP +
      "/" +
      shortName +
      "/trustee/" +
      uuidTrustee +
      "/decrypt-and-prove";
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(descriptions),
    });
    if (response.status === 200) {
      setFeedbackMessage("Desencriptación Parcial enviada exitosamente ✓");
      setActualStep(2);
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      setFeedbackMessage("Error al enviar información, intente nuevamente");
      setActualStep(0);
    }
  }

  const createWorker = (bash, sk, q_num, worker_num) => {
    const worker = new Worker(new URL("./decrypt-worker.js", import.meta.url));
    worker.postMessage({
      params: PARAMS,
      trustee: TRUSTEE,
      election: ELECTION,
      secretKey: sk,
      certificates: CERTIFICATES,
      points: POINTS,
      tally: bash,
    });

    worker.onmessage = function (event) {
      if (event.data.type === "log") return console.log(event.data.msg);
      if (event.data.type === "error") {
        setFeedbackMessage(event.data.message);
        setActualStep(0);
        return;
      }
      if (event.data.type === "result") {
        const tally_factors_and_proof = event.data.tally_factors_and_proof;

        // Guardamos los tally de cada worker
        RESULT_WORKERS[q_num][worker_num] = tally_factors_and_proof;
        WORKERS[q_num] = WORKERS[q_num] + 1;

        // Si es el ultimo worker, une las desencriptaciones
        if (WORKERS[q_num] === WORKERS_QUESTIONS[q_num]) {
          let factor_proofs = {
            decryption_factors: [],
            decryption_proofs: [],
            tally_type: "",
          };

          // Resultados ordenados
          RESULT_WORKERS[q_num].forEach((result) => {
            factor_proofs.decryption_factors =
              factor_proofs.decryption_factors.concat(
                result.decryption_factors
              );
            factor_proofs.decryption_proofs =
              factor_proofs.decryption_proofs.concat(result.decryption_proofs);
            factor_proofs.tally_type = result.tally_type;
          });
          DESCRIPTIONS[q_num] = factor_proofs;
          QUESTIONS_COMPLETE = QUESTIONS_COMPLETE + 1;
        }
        // En caso de que terminamos todas las preguntas
        if (QUESTIONS_COMPLETE === TOTAL_TALLY) {
          let final_json = {
            decryptions: DESCRIPTIONS,
          };
          sendDecrypt(final_json);
        }
      }
    };
  };

  const doTally = (sk) => {
    getEgParams(shortName).then((eg_params) => {
      getDecrypt().then((data) => {
        PARAMS = JSON.parse(eg_params);
        CERTIFICATES = JSON.parse(data.certificates);
        POINTS = JSON.parse(data.points);
        ELECTION = data.election;
        TRUSTEE = data.trustee;

        if (!sk) {
          setFeedbackMessage("Formato de archivo incorrecto");
          setActualStep(0);
          return;
        }

        const tally = JSON.parse(ELECTION.encrypted_tally);
        TOTAL_TALLY = tally.length;
        tally.forEach((t, q_num) => {
          const size = Math.ceil(t.tally.length / TOTAL_WORKERS);
          WORKERS[q_num] = 0;

          // Caso de tally pequeño, solo un hilo de ejecución
          RESULT_WORKERS[q_num] = [];
          if (size < 10) {
            WORKERS_QUESTIONS[q_num] = 1;
            createWorker(t, sk, q_num, 0);
          } else {
            // Seteamos la cantidad total de workers
            WORKERS_QUESTIONS[q_num] = TOTAL_WORKERS;

            for (let i = 0; i < TOTAL_WORKERS; i++) {
              // Copiamos el tally y repartimos el arreglo
              let bash = { ...t };
              bash.tally = t.tally.slice(size * i, size * (i + 1));
              createWorker(bash, sk, q_num, i);
            }
          }
        });
      });
    });
  };
  const decrypt = async (sk) => {
    try {
      setSecretKey(sk);
      setFeedbackMessage("Generando desencriptado parcial...");
      setActualStep(1);
      setTimeout(() => {
        doTally(sk);
      }, 500);
    } catch {
      setFeedbackMessage("Clave incorrecta");
      setActualStep(0);
    }
  };

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            linkExit={`${backendOpIP}/${shortName}/trustee/logout`}
            linkInit={`/${shortName}/trustee/${uuidTrustee}/home`}
          />
          <TitlePsifos
            namePage="Custodio de Claves"
            nameElection={"Etapa 3: Verificación clave privada"}
          />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered has-text-white is-max-desktop">
          <p>
            Se ha calculado el recuento cifrado de la elección.
            <br />
            Ahora es el momento de calcular y enviar su desencriptado parcial.
          </p>

          <div id="sk_section">
            <h3>Inserte su clave privada aquí</h3>
            <DropFile setText={decrypt} />
            <input
              value={secretKey}
              className="input mb-2 mt-4 has-text-centered is-family-monospace"
              placeholder="Clave privada..."
              disabled
            />
            <p
              id={`feedback-message-${actualStep}`}
              className="has-text-white pt-2"
            >
              {feedbackMessage}
              <i
                className={
                  "ml-2 " + (actualStep === 1 && "fa-solid fa-spinner fa-spin")
                }
              ></i>
            </p>

            <div className="d-flex justify-content-center flex-sm-row flex-column-reverse mt-4">
              <button className="button is-link mx-sm-2 mt-2">
                <Link
                  id="go-home-trustee"
                  style={{ textDecoration: "None", color: "white" }}
                  to={`/psifos/${shortName}/trustee/${uuidTrustee}/home`}
                >
                  Volver atrás
                </Link>
              </button>
            </div>
            <div className="mt-4"></div>
          </div>
        </div>
        <ModalDecrypt show={actualStep === 1} />
      </section>
      <div>
        <ImageFooter imagePath={imageTrustees} />
        <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
      </div>
    </div>
  );
}

export default DecryptProve;
