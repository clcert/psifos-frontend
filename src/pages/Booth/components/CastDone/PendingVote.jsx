import { InfoChannels } from "../../../../component/ShortNavBar/ModalHelp";

function PendingVote(props) {
  return (
    <>
      <p className="subtitle is-3 has-text-black mb-1">
        TU VOTO AÚN NO HA SIDO VALIDADO
      </p>
      <p className="subtitle has-text-black send-text">
        El servidor ha recibido tu voto, pero el proceso de validación está
        tomando más tiempo de lo normal.
      </p>
      <p className="subtitle has-text-black send-text">
        Para asegurarte de que tu voto ha sido validado, por favor contactar a
        la mesa de ayuda:
      </p>
      <InfoChannels />
      {/* <ul
        className="mb-5 is-size-4 is-flex is-flex-direction-column is-align-items-flex-start"
        id="help-desk-list"
      >
        <li className="py-1">
          <span className="icon has-text-success">
            <i className="fab fa-whatsapp"></i>
          </span>
          &nbsp;
          <a
            href="https://api.whatsapp.com/send/?phone=56974732599"
            target="_blank"
            rel="noopener noreferrer"
            className="nounderline"
          >
            (+56) 9 7473 2599
          </a>
        </li>
        <li className="py-1">
          <span className="icon has-text-grey">
            <i className="fas fa-envelope"></i>
          </span>
          &nbsp;
          <a
            href="mailto:ayuda.participa@uchile.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="nounderline"
          >
            ayuda.participa@uchile.cl
          </a>
        </li>
        <li className="py-1">
          <span className="icon has-text-info">
            <i className="fab fa-telegram"></i>
          </span>
          &nbsp;
          <a
            href="https://t.me/participauchile"
            target="_blank"
            rel="noopener noreferrer"
            className="nounderline"
          >
            @participaUChile
          </a>
        </li>
        <li className="py-1">
          <span className="icon has-text-info">
            <i className="fab fa-twitter"></i>
          </span>
          &nbsp;
          <a
            href="https://twitter.com/participauchile"
            target="_blank"
            rel="noopener noreferrer"
            className="nounderline"
          >
            @participaUChile
          </a>
        </li>
      </ul> */}

      {/* <p className="subtitle has-text-black mb-0">
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
            shortName +
            "/ballot-box?hash=" +
            encodeURIComponent(props.voteHash)
          }
        >
          verificar aquí
        </a>{" "}
        que tu código de papeleta está presente en la urna electrónica y será
        contabilizada.
      </p> */}

      <a href="https://participa.uchile.cl/">
        <button className="button is-medium my-4" id="back-vote-button">
          <span className="icon is-small">
            <i className="fas fa-2x fa-caret-left"></i>
          </span>
          <span>SALIR</span>
        </button>
      </a>
    </>
  );
}

export default PendingVote;
