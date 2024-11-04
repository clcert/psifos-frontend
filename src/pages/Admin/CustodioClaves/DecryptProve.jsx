import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { backendOpIP } from "../../../server";
import { getEgParams } from "../../../services/crypto";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import DropFile from "./components/DropFile";
import ModalDecrypt from "./components/ModalDecrypt";
import imageTrustees from "../../../static/svg/trustees2.svg";

function DecryptProve() {
  const [actualStep, setActualStep] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Esperando clave para generar desencriptación parcial"
  );

  const { shortName, uuidTrustee } = useParams();

  let PARAMS;
  let CERTIFICATES;
  let POINTS;
  let ELECTION;
  let TRUSTEE;
  let ENCRYPTED_TALLY;
  let DESCRIPTIONS = {};
  let WORKERS = {};
  let RESULT_WORKERS = {};
  let WORKERS_QUESTIONS = {};
  let FINAL_TALLY = [];
  const TOTAL_WORKERS = navigator.hardwareConcurrency
    ? Math.max(navigator.hardwareConcurrency, 4)
    : 1;
  let QUESTIONS_COMPLETE = {};
  let TOTAL_TALLY = {};
  let LENGTH_TALLY = 0;

  const getDecrypt = useCallback(async () => {
    const url = `${backendOpIP}/${shortName}/trustee/${uuidTrustee}/decrypt-and-prove`;
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

  const sendDecrypt = useCallback(async (descriptions) => {
    setFeedbackMessage("Enviando información...");
    const url = `${backendOpIP}/${shortName}/trustee/${uuidTrustee}/decrypt-and-prove`;
    try {
      const response = await fetch(url, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(descriptions),
      });
      if (response.ok) {
        setFeedbackMessage("Desencriptación Parcial Completada ✓");
        setActualStep(2);
        const jsonResponse = await response.json();
        return jsonResponse;
      } else {
        throw new Error("Error al enviar información, intente nuevamente");
      }
    } catch (error) {
      setFeedbackMessage(error.message);
      setActualStep(0);
    }
  }, [shortName, uuidTrustee]);

  const createWorker = (bash, sk, q_num, worker_num, group, with_votes) => {
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
        RESULT_WORKERS[group][q_num][worker_num] = tally_factors_and_proof;
        WORKERS[group][q_num] = WORKERS[group][q_num] + 1;

        // Si es el ultimo worker, une las desencriptaciones
        if (WORKERS[group][q_num] === WORKERS_QUESTIONS[group][q_num]) {
          let factor_proofs = {
            decryption_factors: [],
            decryption_proofs: [],
            tally_type: "",
          };

          // Resultados ordenados
          RESULT_WORKERS[group][q_num].forEach((result) => {
            factor_proofs.decryption_factors =
              factor_proofs.decryption_factors.concat(
                result.decryption_factors
              );
            factor_proofs.decryption_proofs =
              factor_proofs.decryption_proofs.concat(result.decryption_proofs);
            factor_proofs.tally_type = result.tally_type;
          });
          DESCRIPTIONS[group][q_num] = factor_proofs;
          QUESTIONS_COMPLETE[group] = QUESTIONS_COMPLETE[group] + 1;
        }
        // En caso de que terminamos todas las preguntas
        if (QUESTIONS_COMPLETE[group] === TOTAL_TALLY[group]) {
          FINAL_TALLY.push({
            group: group,
            with_votes: with_votes,
            decryptions: DESCRIPTIONS[group],
          });
          check_and_send();
        }
      }
    };
  };

  const check_and_send = () => {
    if (LENGTH_TALLY === FINAL_TALLY.length) {
      sendDecrypt(FINAL_TALLY);
    }
  };

  const handlerDecrypt = async (sk) => {
    try {
      const eg_params = await getEgParams(shortName);
      const data = await getDecrypt();

      PARAMS = JSON.parse(eg_params);
      CERTIFICATES = JSON.parse(data.certificates);
      POINTS = JSON.parse(data.points);
      ELECTION = data.election;
      TRUSTEE = data.trustee;
      ENCRYPTED_TALLY = data.encrypted_tally;

      if (!sk) {
        setFeedbackMessage("Formato de archivo incorrecto");
        setActualStep(0);
        return;
      }

      const groupedTally = ENCRYPTED_TALLY.reduce((acc, item) => {
        if (!acc[item.group]) {
          acc[item.group] = [];
        }
        acc[item.group].push(item);
        return acc;
      }, {});

      Object.values(groupedTally).forEach((items) => {
        if (items[0].with_votes) {
          LENGTH_TALLY += 1;
        }
      });

      for (const [group, items] of Object.entries(groupedTally)) {
        if (items[0].with_votes) {
          doTally(items, sk, group, items[0].with_votes);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const doTally = (tally, sk, group, with_votes) => {
    TOTAL_TALLY[group] = tally.length;
    QUESTIONS_COMPLETE[group] = 0;
    WORKERS[group] = [];
    RESULT_WORKERS[group] = [];
    WORKERS_QUESTIONS[group] = [];
    DESCRIPTIONS[group] = [];

    tally.forEach((t, q_num) => {
      t.tally = JSON.parse(t.tally);
      const size = Math.ceil(t.tally.length / TOTAL_WORKERS);
      WORKERS[group][q_num] = 0;
      RESULT_WORKERS[group][q_num] = [];

      const workerCount = size < 10 ? 1 : TOTAL_WORKERS;
      WORKERS_QUESTIONS[group][q_num] = workerCount;

      for (let i = 0; i < workerCount; i++) {
        const bash = size < 10 ? t : { ...t, tally: t.tally.slice(size * i, size * (i + 1)) };
        createWorker(bash, sk, q_num, i, group, with_votes);
      }
    });
  };
  const decrypt = async (sk) => {
    if (!sk) {
      setFeedbackMessage("Clave incorrecta");
      setActualStep(0);
      return;
    }

    setFeedbackMessage("Generando desencriptado parcial...");
    setActualStep(1);

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      await handlerDecrypt(sk);
    } catch (error) {
      console.error(error);
      setFeedbackMessage("Error al generar desencriptado parcial");
      setActualStep(0);
    }
  };

  return (
    <div id="content-home-admin">
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
          <div id="sk_section">
            <h3>Inserte su archivo con Clave Privada aquí</h3>
            <DropFile setText={decrypt} />
            <p
              id={`feedback-message-${actualStep}`}
              className="has-text-white pt-4 is-size-4"
            >
              {feedbackMessage}
              <i
                className={
                  "ml-2 " + (actualStep === 1 ? "fa-solid fa-spinner fa-spin" : "")
                }
              ></i>
            </p>
              <div className="d-flex justify-content-center flex-sm-row flex-column-reverse mt-4">
                <button className="button is-link mx-sm-2 mt-2">
                  <Link
                    id="go-home-trustee"
                    style={{ textDecoration: "None", color: "white" }}
                  to={
                    actualStep < 2
                      ? `/psifos/${shortName}/trustee/${uuidTrustee}/home`
                      : `/psifos/booth/${shortName}/public-info`
                  }
                  >
                  {actualStep < 2 ? "Volver atrás" : "Ir al Portal de Información"}
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
        <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
      </div>
    </div>
  );
}

export default DecryptProve;
