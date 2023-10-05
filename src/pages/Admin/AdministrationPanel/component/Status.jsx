import { Link } from "react-router-dom";
import { electionStatus } from "../../../../constants";

function Status({
  election,
  uploadModalonClick,
  freezeModal,
  closeModal,
  tallyModal,
  releaseModal,
  combineTallyModal,
}) {
  const electionStep = election.election_status;
  const canCombineDecryptions =
    electionStep === "Decryptions uploaded" ||
    (electionStep === "Tally computed" &&
      election.decryptions_uploaded >=
        Math.floor(election.total_trustees / 2) + 1);

  return (
    <>
      {" "}
      {!election.total_voters > 0 &&
        election.private_p &&
        electionStep === "Setting up" && (
          <div className="content-card-admin">
            <span
              onClick={() => {
                uploadModalonClick(true);
              }}
              className="panel-text-sect"
            >
              <Link id="button-add-voters" className="link-without-line" to="">
                Añadir votantes
              </Link>
            </span>
          </div>
        )}
      {election.questions === null &&
        electionStep === electionStatus.settingUp && (
          <div className="content-card-admin">
            <span className="panel-text-sect">
              <Link
                id="button-add-questions"
                className="link-without-line"
                to={
                  "/psifos/admin/" + election.short_name + "/create-question/"
                }
              >
                Añadir preguntas
              </Link>
            </span>
          </div>
        )}
      {election.total_trustees === 0 &&
        electionStep === electionStatus.settingUp && (
          <div className="content-card-admin">
            <span className="panel-text-sect">
              <Link
                id="button-add-trustee"
                className="link-without-line"
                to={"/psifos/admin/" + election.short_name + "/trustee"}
              >
                Añadir custodios
              </Link>
            </span>
          </div>
        )}
      {(election.total_voters > 0 || !election.private_p) &&
        election.questions !== null &&
        election.total_trustees !== 0 &&
        electionStep === "Setting up" && (
          <div className="content-card-admin">
            <span onClick={() => freezeModal()} className="panel-text-sect">
              <Link id="init-election" className="link-without-line" to="">
                Iniciar elección
              </Link>
            </span>
          </div>
        )}
      {electionStep === "Started" && (
        <div className="content-card-admin">
          <span onClick={() => closeModal()} className="panel-text-sect">
            <Link id="close-election" className="link-without-line" to="">
              Cerrar elección
            </Link>
          </span>
        </div>
      )}
      {electionStep === "Ended" && (
        <div className="content-card-admin">
          <span onClick={() => tallyModal()} className="panel-text-sect">
            <Link id="compute-tally" className="link-without-line" to="">
              Computar Tally
            </Link>
          </span>
        </div>
      )}
      {electionStep === electionStatus.computingTally && (
        <div className="content-card-admin">
          <span className="panel-text-sect">
            Computando tally ...{" "}
            <i id="step_1" className="fa-solid fa-spinner fa-spin" />
          </span>
        </div>
      )}
      {electionStep === electionStatus.tallyComputed && (
        <div className="content-card-admin">
          <span className="panel-text-sect">
            <Link
              className="link-without-line"
              to={"/psifos/admin/" + election.short_name + "/trustee"}
            >
              Esperando desencriptaciones parciales
            </Link>
          </span>
        </div>
      )}
      {canCombineDecryptions && (
        <div className="content-card-admin">
          <span onClick={() => combineTallyModal()} className="panel-text-sect">
            <Link className="link-without-line" to="">
              Combinar desencriptaciones parciales
            </Link>
          </span>
        </div>
      )}
      {electionStep === electionStatus.decryptionsCombined && (
        <div className="content-card-admin">
          <span onClick={() => releaseModal()} className="panel-text-sect">
            <Link to="" className="link-without-line">
              Liberar los resultados
            </Link>
          </span>
        </div>
      )}
      {(electionStep === electionStatus.resultsReleased ||
        electionStep === electionStatus.decryptionsCombined) && (
          <div className="content-card-admin">
            <span
              onClick={() => combineTallyModal()}
              className="panel-text-sect"
            >
              <Link
                to={"/psifos/admin/" + election.short_name + "/resultado"}
                className="link-without-line"
              >
                Ver resultados
              </Link>
            </span>
          </div>
        )}
    </>
  );
}
export default Status;
