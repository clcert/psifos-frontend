import { useState } from "react";
import { Link } from "react-router-dom";
import {
  electionLoginType,
  electionStatusTranslate,
} from "../../../../constants";

const DisplayStats = ({ name, value }) => (
  <div className="content-card-admin">
    <span className="panel-text-sect">{name}</span>: {value}
  </div>
);

const DisplayTicket = ({ name, condition }) => (
  <div className="content-card-admin">
    <span className="panel-text-sect">{name}</span>:{" "}
    <i className={`fa-solid ${condition ? "fa-check" : "fa-x"}`} />
  </div>
);

const CardInfo = ({
  election,
  electionStep,
  updateInfo,
  totalVoters,
  totalVotes,
  totalTrustees,
}) => {
  const [decryptionNumber, setDecryptionNumber] = useState(0);

  return (
    <div className="box">
      <div className="is-size-4">
        Información elección
        <span className="ml-3 is-size-6" onClick={updateInfo}>
          <Link className="link-without-line" to="">
            <i className="fa-solid fa-arrows-rotate"></i> Actualizar
          </Link>
        </span>
      </div>

      <hr />
      <div className="is-size-5">
        <DisplayStats
          name="Estado"
          value={electionStatusTranslate[electionStep]}
        />
        <DisplayStats
          name="Tipo de votación"
          value={election.type === "Election" ? "Elección" : "Consulta"}
        />
        <DisplayStats name="Cantidad de votantes" value={totalVoters} />
        <DisplayStats name="Votos recibidos" value={totalVotes} />
        <DisplayStats name="Peso máximo de votantes" value={election.max_weight} />
        <DisplayStats name="Numero Custodios" value={totalTrustees} />
        <DisplayTicket
          name="Elección privada"
          condition={election.voters_login_type === electionLoginType.close_p}
        />
        <DisplayTicket
          name="Aleatorizar opciones"
          condition={election.randomize_answer_order}
        />
        <DisplayTicket name="Elección agrupada" condition={election.grouped_voters} />
        <DisplayTicket name="Normalización" condition={election.normalized} />
      </div>
    </div>
  );
};

export default CardInfo;
