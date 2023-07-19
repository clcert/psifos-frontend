import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { electionStatusTranslate } from "../../../../constants";

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
        <div className="content-card-admin">
          <span className="panel-text-sect">Estado</span>:{" "}
          {electionStatusTranslate[electionStep]}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Tipo de votación</span>:{" "}
          {election.election_type === "Election" ? "Elección" : "Consulta"}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Cantidad de votantes</span>:{" "}
          {totalVoters}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Votos recibidos</span>: {totalVotes}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Numero Custodios</span>:{" "}
          {trustees.length}
        </div>

        {electionStep === "Tally computed" ||
          (electionStep === "Decryptions uploaded" && (
            <div className="content-card-admin">
              <span className="panel-text-sect">
                Desencriptaciones Parciales
              </span>
              : {decryptionNumber}/{trustees.length}
            </div>
          ))}

        <div className="content-card-admin">
          <span className="panel-text-sect">
            Esconder nombre de los votantes:{" "}
          </span>
          {election.obscure_voter_names ? (
            <i className="fa-solid fa-check" />
          ) : (
            <i className="fa-solid fa-x" />
          )}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Elección privada</span>:{" "}
          {election.private_p ? (
            <i className="fa-solid fa-check" />
          ) : (
            <i className="fa-solid fa-x" />
          )}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Aleatorizar respuestas</span>:{" "}
          {election.randomize_answer_order ? (
            <i className="fa-solid fa-check" />
          ) : (
            <i className="fa-solid fa-x" />
          )}
        </div>
      </div>
    </div>
  );
}

export default CardInfo;
