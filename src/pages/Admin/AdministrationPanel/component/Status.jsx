import { Link } from "react-router-dom";

function Status(props) {
  const canCombineDecryptions =
    props.electionStatus === "Decryptions uploaded" ||
    (props.electionStatus === "Tally computed" &&
      props.election.decryptions_uploaded >=
        Math.floor(props.election.total_trustees / 2) + 1);

  return (
    <>
      {" "}
      {!props.election.total_voters > 0 &&
        props.election.private_p &&
        props.electionStatus === "Setting up" && (
          <div className="content-card-admin">
            <span
              onClick={() => {
                props.uploadModalonClick(true);
              }}
              className="panel-text-sect"
            >
              <Link id="button-add-voters" className="link-without-line" to="">
                Añadir votantes
              </Link>
            </span>
          </div>
        )}
      {props.election.questions === null &&
        props.electionStatus === "Setting up" && (
          <div className="content-card-admin">
            <span className="panel-text-sect">
              <Link
                id="button-add-questions"
                className="link-without-line"
                to={
                  "/psifos/admin/" +
                  props.election.short_name +
                  "/create-question/"
                }
              >
                Añadir preguntas
              </Link>
            </span>
          </div>
        )}
      {props.election.trustees.length === 0 &&
        props.electionStatus === "Setting up" && (
          <div className="content-card-admin">
            <span className="panel-text-sect">
              <Link
                id="button-add-trustee"
                className="link-without-line"
                to={"/psifos/admin/" + props.election.short_name + "/trustee"}
              >
                Añadir custodios
              </Link>
            </span>
          </div>
        )}
      {(props.election.total_voters > 0 || !props.election.private_p) &&
        props.election.questions !== null &&
        props.election.trustees.length !== 0 &&
        props.electionStatus === "Setting up" && (
          <div className="content-card-admin">
            <span
              onClick={() => props.freezeModal()}
              className="panel-text-sect"
            >
              <Link id="init-election" className="link-without-line" to="">
                Iniciar elección
              </Link>
            </span>
          </div>
        )}
      {props.electionStatus === "Started" && (
        <div className="content-card-admin">
          <span onClick={() => props.closeModal()} className="panel-text-sect">
            <Link id="close-election" className="link-without-line" to="">
              Cerrar elección
            </Link>
          </span>
        </div>
      )}
      {props.electionStatus === "Ended" && (
        <div className="content-card-admin">
          <span onClick={() => props.tallyModal()} className="panel-text-sect">
            <Link id="compute-tally" className="link-without-line" to="">
              Computar Tally
            </Link>
          </span>
        </div>
      )}
      {props.electionStatus === "Tally computed" && (
        <div className="content-card-admin">
          <span className="panel-text-sect">
            <Link
              className="link-without-line"
              to={"/psifos/admin/" + props.election.short_name + "/trustee"}
            >
              Esperando desencriptaciones parciales
            </Link>
          </span>
        </div>
      )}
      {canCombineDecryptions && (
        <div className="content-card-admin">
          <span
            onClick={() => props.combineTallyModal()}
            className="panel-text-sect"
          >
            <Link className="link-without-line" to="">
              Combinar desencriptaciones parciales
            </Link>
          </span>
        </div>
      )}
      {props.electionStatus === "Decryptions combined" && (
        <div className="content-card-admin">
          <span
            onClick={() => props.combineTallyModal()}
            className="panel-text-sect"
          >
            <Link
              to={"/psifos/admin/" + props.election.short_name + "/resultado"}
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
