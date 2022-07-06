import { Link, useParams } from "react-router-dom";

function CardSteps(props) {
  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();
  return (
    <div className="box ">
      <div className="is-size-4">Proximos pasos</div>

      <hr />

      {!props.haveVoters && props.electionStatus === "Setting up" && (
        <div className="content-card-admin">
          <span
            onClick={() => {
              props.uploadModalonClick(true);
            }}
          >
            <Link className="link-without-line" to="">
              Añadir votantes
            </Link>
          </span>
        </div>
      )}
      {!props.haveQuestions && props.electionStatus === "Setting up" && (
        <div className="content-card-admin">
          <Link
            className="link-without-line"
            to={"/admin/" + uuid + "/create-question/"}
          >
            Añadir Preguntas
          </Link>
        </div>
      )}
      {!props.haveTrustee && props.electionStatus === "Setting up" && (
        <div className="content-card-admin">
          <Link
            className="link-without-line"
            to={"/admin/" + uuid + "/trustee"}
          >
            Añadir Custodios
          </Link>
        </div>
      )}

      {props.haveVoters &&
        props.haveQuestions &&
        props.haveTrustee &&
        props.electionStatus === "Setting up" && (
          <div className="content-card-admin">
            <span onClick={() => props.freezeModal()} className="">
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
          <Link
            className="link-without-line"
            to={"/admin/" + uuid + "/trustee"}
          >
            Esperando desencriptaciones parciales
          </Link>
        </div>
      )}
      {props.electionStatus === "Decryptions uploaded" && (
        <div className="content-card-admin">
          <span onClick={() => props.combineTallyModal()}>
            <Link className="link-without-line" to="">
              Combinar desencriptaciones parciales
            </Link>
          </span>
        </div>
      )}
      {props.electionStatus === "Decryptions combined" && (
        <div className="content-card-admin">
          <span onClick={() => props.combineTallyModal()}>
            <Link to={"/admin/" + uuid + "/resultado"} className="link-without-line">
              Ver resultados
            </Link>
          </span>
        </div>
      )}
    </div>
  );
}

export default CardSteps;
