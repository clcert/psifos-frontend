import { useState } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";

function CardInfo(props) {

  const [decryptionNumber, setDecryptionNumber] = useState(0);

  useEffect(() => {
    let number_decryptions = 0;
    props.trustees.forEach((trustee) => {
      if (trustee.decryptions !== "") {
        number_decryptions++;
      }
    });
    setDecryptionNumber(number_decryptions);
  }, [props.trustees]);

  return (
    <div className="box ">
      <div className="is-size-4">
        Información elección
        <span className="ml-3 is-size-6" onClick={()=> {props.updateInfo()}}>
          <Link className="link-without-line" to=""><i className="fa-solid fa-arrows-rotate"></i> Actualizar</Link>
        </span>
      </div>

      <hr />
      <div className="is-size-5">
        <div className="content-card-admin">
          <span className="panel-text-sect">Estado</span>: Activa
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Tipo de votación</span>:{" "}
          {props.typeElection === "Election" ? "Elección" : "Consulta"}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Cantidad de votantes</span>:{" "}
          {props.totalVoters}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Votos recibidos</span>:{" "}
          {props.totalVoters}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Numero Custodios</span>:{" "}
          {props.trustees.length}
        </div>

        {props.electionStatus === "Tally computed" ||
          (props.electionStatus === "Decryptions uploaded" && (
            <div className="content-card-admin">
              <span className="panel-text-sect">
                Desencriptaciones Parciales
              </span>
              : {decryptionNumber}/{props.trustees.length}
            </div>
          ))}

        <div className="content-card-admin">
          <span className="panel-text-sect">
            Esconder nombre de los votantes:{" "}
          </span>
          {props.obscureVoter ? (
            <i className="fa-solid fa-check" />
          ) : (
            <i className="fa-solid fa-x" />
          )}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Elección privada</span>:{" "}
          {props.privateElection ? (
            <i className="fa-solid fa-check" />
          ) : (
            <i className="fa-solid fa-x" />
          )}
        </div>

        <div className="content-card-admin">
          <span className="panel-text-sect">Aleatorizar respuestas</span>:{" "}
          {props.randomizeAnswers ? (
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
