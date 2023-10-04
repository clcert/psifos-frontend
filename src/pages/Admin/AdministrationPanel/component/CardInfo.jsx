import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { electionStatusTranslate } from "../../../../constants";

const DisplayStats = ({ name, value }) => {
  return (
    <div className="content-card-admin">
      <span className="panel-text-sect">{name}</span>: {value}
    </div>
  );
};

const DisplayTicket = ({ name, condition }) => {
  return (
    <div className="content-card-admin">
      <span className="panel-text-sect">{name}</span>:{" "}
      {condition ? (
        <i className="fa-solid fa-check" />
      ) : (
        <i className="fa-solid fa-x" />
      )}
    </div>
  );
};

function CardInfo({
  election,
  electionStep,
  trustees,
  updateInfo,
  totalVoters,
  totalVotes,
}) {
  /** @state {num} number of decryptions */
  const [decryptionNumber, setDecryptionNumber] = useState(0);

  useEffect(() => {
    let number_decryptions = 0;
    trustees.forEach((trustee) => {
      if (trustee.decryptions !== "") {
        number_decryptions++;
      }
    });
    setDecryptionNumber(number_decryptions);
  }, [trustees, electionStep]);

  return (
    <div className="box ">
      <div className="is-size-4">
        Información elección
        <span
          className="ml-3 is-size-6"
          onClick={() => {
            updateInfo();
          }}
        >
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
          value={
            election.election_type === "Election" ? "Elección" : "Consulta"
          }
        />
        <DisplayStats name="Cantidad de votantes" value={totalVoters} />
        <DisplayStats name="Votos recibidos" value={totalVotes} />
        <DisplayStats
          name="Peso máximo de votantes"
          value={election.max_weight}
        />
        <DisplayStats name="Numero Custodios" value={trustees.length} />
        {electionStep === "Tally computed" ||
          (electionStep === "Decryptions uploaded" && (
            <DisplayStats
              name="Desencriptaciones Parciales"
              value={decryptionNumber / trustees.length}
            />
          ))}

        <DisplayTicket
          name="Esconder nombre de los votantes"
          condition={election.obscure_voter_names}
        />
        <DisplayTicket name="Elección privada" condition={election.private_p} />
        <DisplayTicket
          name="Aleatorizar respuestas"
          condition={election.randomize_answer_order}
        />
        <DisplayTicket name="Elección agrupada" condition={election.grouped} />
        <DisplayTicket
          name="Normalización"
          condition={election.normalization}
        />
      </div>
    </div>
  );
}

export default CardInfo;
