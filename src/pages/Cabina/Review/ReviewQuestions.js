import reviewImage from "../../../static/cabina/svg/review-img.svg";
import AuditModal from "./AuditModal";
import React, { useState } from "react";

function ReviewQuestions(props) {
  const [showModal, setShowModal] = useState(false);
  console.log(props.answers);
  return (
    <section className="section pb-0" id="review-section">
      <div className="container has-text-centered is-max-desktop">
        <h1 className="title is-4 has-text-black pt-6">REVISA TU VOTACIÓN</h1>
        <p className="subtitle">
          A continuación podrás revisar tu papeleta de votación.
        </p>
        {Object.keys(props.questions).map((key, index) => {
          console.log(props.questions[key]);
          return (
            <div key={index}>
              <p className="subtitle is-4 mt-6 mb-2 has-text-black">
                {props.questions[key].short_name}
              </p>
              <div className="box has-text-left pl-6 review-answer">
                <p className="subtitle is-5 has-text-white answer-text">
                  {props.answers[index] === []
                    ? "[ ] Ninguna opción seleccionada"
                    : props.answers[index].map((key, index) => {
                        return (
                          <React.Fragment key={index}>
                            <span key={index}>
                              {"[ ✓ ] " +
                                props.questions[key].answers[key] +
                                " "}
                            </span>
                            <br />
                          </React.Fragment>
                        );
                      })}

                  <br />
                  <a onClick={() => props.changeAnswer(index)}>
                    <span className="icon has-text-white">
                      <i className="far fa-edit"></i>
                    </span>
                    <span className="has-text-white is-size-6">
                      Editar Respuesta (opcional)
                    </span>
                  </a>
                </p>
              </div>
            </div>
          );
        })}

        <div className="container has-text-centered mt-6">
          <div className="columns pb-0 is-align-items-center review-buttons-container">
            <div className="column is-hidden-mobile">
              <div className="container">
                <button
                  className="button is-medium review-buttons"
                  id="audit-button"
                  onClick={() => {
                    setShowModal(true);
                  }}
                >
                  <span className="icon">
                    <i className="far fa-envelope-open"></i>
                  </span>

                  <span>AUDITAR VOTO</span>
                </button>
                <br />
              </div>
              <span className="is-size-6 is-italic">(Opcional)</span>
              <span
                className="icon question-audit has-tooltip-arrow has-tooltip-left has-tooltip-top-mobile has-tooltip-multiline has-tooltip-info"
                data-tooltip="Verificación avanzada de correcta encriptación de las preferencias."
              >
                <i className="far fa-question-circle"></i>
              </span>
            </div>
            <div className="column pb-0 is-hidden-mobile">
              <figure className="image select-img-wrapper">
                <img id="review-final-img" src={reviewImage} alt="" />
              </figure>
            </div>
            <div className="column right-button-column has-text-centered-mobile is-flex">
              <button
                className="button is-medium review-buttons"
                id="proceed_button"
                onClick={props.sendAnswer}
              >
                <span className="icon">
                  <i className="fas fa-paper-plane"></i>
                </span>
                <span>ENVIAR VOTO</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <AuditModal
        showModal={showModal}
        onHide={() => {
          setShowModal(false);
        }}
        auditBack={props.auditBack}
        audit={props.audit}
      />
    </section>
  );
}

export default ReviewQuestions;
