import { Link } from "react-router-dom";

function Status(props) {
  return (
    <>
      {" "}
      {!props.haveVoters && props.electionStatus === "Setting up" && (
        <div className="content-card-admin">
          <span
            onClick={() => {
              props.uploadModalonClick(true);
            }}
            className="panel-text-sect"
          >
            <Link className="link-without-line" to="">
              Añadir votantes
            </Link>
          </span>
        </div>
      )}
      {!props.haveQuestions && props.electionStatus === "Setting up" && (
        <div className="content-card-admin">
          <span className="panel-text-sect">
            <Link
              className="link-without-line"
              to={"/psifos/admin/" + props.uuid + "/create-question/"}
            >
              Añadir preguntas
            </Link>
          </span>
        </div>
      )}
      {!props.haveTrustee && props.electionStatus === "Setting up" && (
        <div className="content-card-admin">
          <span className="panel-text-sect">
            <Link
              className="link-without-line"
              to={"/psifos/admin/" + props.uuid + "/trustee"}
            >
              Añadir custodios
            </Link>
          </span>
        </div>
      )}
      {props.haveVoters &&
        props.haveQuestions &&
        props.haveTrustee &&
        props.electionStatus === "Setting up" && (
          <div className="content-card-admin">
            <span
              onClick={() => props.freezeModal()}
              className="panel-text-sect"
            >
              <Link className="link-without-line" to="">
                Iniciar elección
              </Link>
            </span>
          </div>
        )}
      {props.electionStatus === "Started" && (
        <div className="content-card-admin">
          <span onClick={() => props.closeModal()} className="panel-text-sect">
            <Link className="link-without-line" to="">
              Cerrar elección
            </Link>
          </span>
        </div>
      )}
      {props.electionStatus === "Ended" && (
        <div className="content-card-admin">
          <span onClick={() => props.tallyModal()} className="panel-text-sect">
            <Link className="link-without-line" to="">
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
              to={"/psifos/admin/" + props.uuid + "/trustee"}
            >
              Esperando desencriptaciones parciales
            </Link>
          </span>
        </div>
      )}
      {props.electionStatus === "Decryptions uploaded" && (
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
              to={"/psifos/admin/" + props.uuid + "/resultado"}
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
