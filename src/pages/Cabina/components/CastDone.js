import sendImage from "../../../static/cabina/svg/send-img.svg";

function CastDone(props) {
  return (
    <section class="section pb-0" id="send-section">
      <div class="container has-text-centered is-max-desktop">
        <p class="subtitle is-3 has-text-black mb-1">
          HEMOS RECIBIDO TU VOTO EXITOSAMENTE
        </p>
        <p class="subtitle has-text-black send-text">
          Si tu papeleta no es objetada, será incorporada al conteo final.
        </p>
        <p class="subtitle has-text-black mb-0">
          Código de Papeleta:
          <span
            class="icon question-audit has-tooltip-arrow has-tooltip-right has-tooltip-left-mobile has-tooltip-multiline has-tooltip-info"
            data-tooltip="Código único o número serial de la papeleta encriptada. NO revela el contenido del voto."
          >
            <i class="far fa-question-circle"></i>
          </span>
        </p>
        <p class="subtitle py-1 mb-5" id="vote-code">
          <a
            id="vote-fingerprint-anchor"
            onclick="copyToClipboard('#vote-fingerprint')"
            class="has-tooltip-arrow has-tooltip-bottom has-tooltip-info"
            data-tooltip="Copiar"
          >
            <strong>
              <tt class="has-text-white py-3" id="vote-fingerprint"></tt>
            </strong>
          </a>
        </p>

        <p class="subtitle is-5 pb-3">
          Puedes <a href="">verificar aquí</a> que tu código de papeleta está
          presente en la urna electrónica y será contabilizada.
        </p>
        <a href="https://participa.uchile.cl/">
          <button class="button is-medium my-4" id="back-button">
            <span class="icon is-small">
              <i class="fas fa-2x fa-caret-left"></i>
            </span>
            <span>IR A PÁGINA PRINCIPAL</span>
          </button>
        </a>
      </div>

      <figure class="image send-img-wrapper pt-4">
        <img id="send-final-img" src={sendImage} />
      </figure>
    </section>
  );
}

export default CastDone;
