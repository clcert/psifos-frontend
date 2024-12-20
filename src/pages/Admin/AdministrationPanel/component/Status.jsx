import { Link } from "react-router-dom";
import { electionLoginType, electionStatus, trusteeStep } from "../../../../constants";
import { useSelector } from "react-redux";

function Status({
  election,
  uploadModalonClick,
  generationReadyModal,
  openingReadyModal,
  backToSettingModal,
  freezeModal,
  closeModal,
  tallyModal,
  releaseModal,
  combineTallyModal,
  totalVoters,
  totalTrustees,
}) {
  const defaultTotalVoters = useSelector((state) => state.election.totalVoters);
  const defaultTotalTrustees = useSelector((state) => state.election.totalTrustees);

  totalVoters = totalVoters ?? defaultTotalVoters;
  totalTrustees = totalTrustees ?? defaultTotalTrustees;

  const checkTrustees = () => {
    const hasInvalidTrustee = election.trustees && election.trustees.some((trustee) => {
      if (trustee.current_step !== trusteeStep.waiting_decryptions) {
        return true;
      }
      return false;
    });
    return !hasInvalidTrustee;
  }

  const electionStep = election.status;
  const canCombineDecryptions =
    electionStep === electionStatus.decryptionsUploaded ||
    (electionStep === electionStatus.tallyComputed &&
      election.decryptions_uploaded >=
        Math.floor(totalTrustees / 2) + 1);

  const keyGenerationReady =
    electionStep === electionStatus.settingUp &&
    (totalVoters > 0 || electionLoginType.close_p !== election.voters_login_type) &&
    totalTrustees > 0 &&
    election.questions &&
    election.questions.length > 0

  const openingReady = electionStep === electionStatus.readyForKeyGeneration && checkTrustees();

  const renderLink = (id, onClick, to, text) => (
    <div className="content-card-admin">
      <span onClick={onClick} className="panel-text-sect">
        <Link id={id} className="link-without-line" to={to}>
          {text}
        </Link>
      </span>
    </div>
  );
  return (
    <>
      {totalVoters === 0 &&
        election.voters_login_type === electionLoginType.close_p &&
        electionStep === electionStatus.settingUp &&
        renderLink(
          "button-add-voters",
          () => uploadModalonClick(true),
          "",
          "Añadir votantes"
        )}

      {election.questions &&
        election.questions.length === 0 &&
        electionStep === electionStatus.settingUp &&
        renderLink(
          "button-add-questions",
          null,
          `/psifos/admin/${election.short_name}/create-question/`,
          "Añadir preguntas"
        )}

      {totalTrustees === 0 &&
        electionStep === electionStatus.settingUp &&
        renderLink(
          "button-add-trustee",
          null,
          `/psifos/admin/${election.short_name}/trustee`,
          "Añadir custodios"
        )}

      {electionStep === electionStatus.readyForOpening &&
        renderLink("init-election", freezeModal, "", "Iniciar elección")}

      {keyGenerationReady &&
        renderLink(
          "generate-keys",
          generationReadyModal,
          "",
          "Preparar para la generación de claves"
        )}

      {openingReady &&
        renderLink("generate-keys", openingReadyModal, "", "Cerrar generación de claves")}

      {electionStep === electionStatus.started &&
        renderLink("close-election", closeModal, "", "Cerrar elección")}

      {electionStep === electionStatus.ended &&
        renderLink("compute-tally", tallyModal, "", "Computar Tally")}

      {electionStep === electionStatus.readyForKeyGeneration  && !openingReady && (
        <div className="content-card-admin">
          <span className="panel-text-sect">
            Esperando generación de claves...{" "}
            <i id="step_1" className="fa-solid fa-spinner fa-spin" />
          </span>
        </div>
      )}

      {electionStep === electionStatus.readyForKeyGeneration && (
        renderLink("back-to-setting-up", backToSettingModal, "", "Volver a la configuración")
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
              to={`/psifos/admin/${election.short_name}/trustee`}
            >
              Esperando desencriptaciones parciales
            </Link>
          </span>
        </div>
      )}

      {canCombineDecryptions &&
        renderLink(
          null,
          combineTallyModal,
          "",
          "Combinar desencriptaciones parciales"
        )}

      {electionStep === electionStatus.decryptionsCombined &&
        renderLink(null, releaseModal, "", "Liberar los resultados")}

      {(electionStep === electionStatus.resultsReleased ||
        electionStep === electionStatus.decryptionsCombined) &&
        renderLink(
          null,
          combineTallyModal,
          `/psifos/admin/${election.short_name}/resultado`,
          "Ver resultados"
        )}
    </>
  );
}

export default Status;
