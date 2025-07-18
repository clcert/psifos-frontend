import AuditModal from "./AuditModal";
import React, { useState } from "react";
import VerifyVoteModal from "../../components/VerifyVoteModal";
import TextSelected from "./TextSelected";

function ReviewQuestions(props) {
  const [showModal, setShowModal] = useState(false);
  return (
    <section className="section py-0" id="review-section">
      <div className="container has-text-centered is-max-desktop">
        <h1 className="title is-4 has-text-black pt-6">REVISA TU VOTACIÓN</h1>
        <p className="subtitle">
            Revise su(s) preferencia(s) seleccionada(s)<br/>
        </p>
        {props.questions.map((question, index) => {
          return (
            <div key={index}>
              <p className="subtitle is-4 mt-6 mb-2 has-text-black">
                {question.title}
              </p>
              <div className="box has-text-left pl-6 review-answer">
                <div className="subtitle is-5 has-text-white answer-text mb-0">
                  <TextSelected
                    answer={props.answers[index]}
                    question={question}
                  />
                    <div className="is-flex is-justify-content-end">
                  <a
                    onClick={() => props.changeAnswer(index)}
                    className="change-answer-button"
                  >
                    <span className="icon has-text-white">
                      <i className="far fa-edit"></i>
                    </span>
                    <span className="is-size-6">Cambiar Respuesta</span>
                  </a>
                    </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="container has-text-centered mt-6">
          <div className="columns pb-0 is-align-items-center review-buttons-container">
            <div className="column right-button-column has-text-centered-mobile is-flex mb-3">
              <button
                className="button is-medium question-button proceed-button"
                id="proceed_button"
                onClick={props.sendVote}
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
        auditBack={props.auditBack}
        audit={props.audit}
        onHide={() => {
          setShowModal(false);
        }}
      />
      <VerifyVoteModal
        show={props.modalVerify}
        setVoteVerificates={props.setVoteVerificates}
        voteHash={props.voteHash}
        afterVerify={() => {
          props.afterVerify();
        }}
      />
    </section>
  );
}

export default ReviewQuestions;