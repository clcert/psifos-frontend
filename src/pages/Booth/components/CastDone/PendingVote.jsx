import { useParams } from "react-router-dom";
import { frontIP } from "../../../../server";

function PendingVote(props) {
  const { uuid } = useParams();

  return (
    <>
      <p className="subtitle is-3 has-text-black mb-1">
        HEMOS RECIBIDO TU VOTO PERO AUN NO HA SIDO VALIDADO
      </p>
      <p className="subtitle has-text-black send-text">
        Si tu papeleta no es objetada, será incorporada al conteo final.
      </p>
      <p className="subtitle has-text-black mb-0">
        Código de Papeleta:
        <span
          className="icon question-audit has-tooltip-arrow has-tooltip-right has-tooltip-left-mobile has-tooltip-multiline has-tooltip-info"
          data-tooltip="Código único o número serial de la papeleta encriptada. NO revela el contenido del voto."
        >
          <i className="far fa-question-circle"></i>
        </span>
      </p>
      <p className="subtitle py-1 mb-5" id="vote-code">
        {props.voteHash}
        <a
          id="vote-fingerprint-anchor"
          className="has-tooltip-arrow has-tooltip-bottom has-tooltip-info"
          data-tooltip="Copiar"
          href={() => false}
        >
          <strong>
            <tt className="has-text-white py-3" id="vote-fingerprint"></tt>
          </strong>
        </a>
      </p>

      <p className="subtitle is-5 pb-3">
        Puedes{" "}
        <a
          href={
            frontIP +
            "/booth/" +
            uuid +
            "/ballot-box?hash=" +
            encodeURIComponent(props.voteHash)
          }
        >
          verificar aquí
        </a>{" "}
        que tu código de papeleta está presente en la urna electrónica y será
        contabilizada.
      </p>
      <a href="https://participa.uchile.cl/">
        <button className="button is-medium my-4" id="back-vote-button">
          <span className="icon is-small">
            <i className="fas fa-2x fa-caret-left"></i>
          </span>
          <span>IR A PÁGINA PRINCIPAL</span>
        </button>
      </a>
    </>
  );
}

export default PendingVote;
