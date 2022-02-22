import reviewImage from "../../../static/cabina/svg/review-img.svg";

function ReviewQuestions(props) {
  return (
    <section class="section pb-0" id="review-section">
      <div class="container has-text-centered is-max-desktop">
        <h1 class="title is-4 has-text-black pt-6">REVISA TU VOTACIÓN</h1>
        <p class="subtitle">
          A continuación podrás revisar tu papeleta de votación.
        </p>

        <p class="subtitle is-4 mt-6 mb-2 has-text-black">
          {"$T.question.short_name"}
        </p>
        <div class="box has-text-left pl-6 review-answer">
          <p class="subtitle is-5 has-text-white answer-text">
            [ ] Ninguna opción seleccionada <br />[ ✓ ] {"$T.choice"} <br />
            <br />
            <a
              onclick="BOOTH.show_question({$T.question$index}, true);$(window).scrollTop($('#progress_div').position().top); return false;"
              href="#"
            >
              <span class="icon has-text-white">
                <i class="far fa-edit"></i>
              </span>
              <span class="has-text-white is-size-6">
                Editar Respuesta (opcional)
              </span>
            </a>
          </p>
        </div>

        <div class="container has-text-centered mt-6">
          <div class="columns pb-0 is-align-items-center review-buttons-container">
            <div class="column is-hidden-mobile is-invisible">
              <div class="container">
                <span
                  class="icon question-audit has-tooltip-arrow has-tooltip-left has-tooltip-top-mobile has-tooltip-multiline has-tooltip-info"
                  data-tooltip="Verificación avanzada de correcta encriptación de las preferencias."
                >
                  <i class="far fa-question-circle"></i>
                </span>
                <button
                  class="button is-small review-buttons"
                  id="audit-button"
                  onclick="$('#audit-modal').addClass('is-active');"
                >
                  <span class="icon">
                    <i class="far fa-envelope-open"></i>
                  </span>
                  <span>AUDITAR VOTO</span>
                </button>
                <br />
                <span class="is-size-6 is-italic">(Opcional)</span>
              </div>
            </div>
            <div class="column pb-0 is-hidden-mobile">
              <figure class="image select-img-wrapper">
                <img id="review-final-img" src={reviewImage} />
              </figure>
            </div>
            <div class="column right-button-column has-text-centered-mobile is-flex">
              <button
                class="button is-medium review-buttons"
                id="proceed_button"
                onClick={props.finish}
              >
                <span class="icon">
                  <i class="fas fa-paper-plane"></i>
                </span>
                <span>ENVIAR VOTO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReviewQuestions;
