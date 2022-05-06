import { useState, useEffect } from "react";
import selectImg from "../../../../static/cabina/svg/select-img.svg";
import FinishButton from "../../components/Buttons/FinishButton";
import InputCheckbox from "./Questions/InputCheckbox";
import InputRadio from "./Questions/InputRadio";
import NextButton from "../../components/Buttons/NextButton";
import PreviousButton from "../../components/Buttons/PreviousButton";
import QuestionHeader from "./QuestionHeader";
import ModalPercentage from "../../components/ModalPercentage";
import AlertQuestions from "./Questions/AlertQuestions";

function Question(props) {
  const [answers, setAnswers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [finished, setFinished] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [messageAlert, setMessageAlert] = useState("");

  function addAnswer(answer, index) {
    let answersAux = [...answers];
    answersAux[index] = answer;
    setAnswers(answersAux);
  }

  useEffect(() => {
    let answersAux = [];
    for (let i = 0; i < props.questions.length; i++) {
      answersAux.push([]);
    }
    setAnswers(answersAux);
  }, []);

  function createMessageAlert(min, max) {
    if (min === max) {
      setMessageAlert("Debes seleccionar " + min + " respuesta(s)");
    } else {
      setMessageAlert(
        "Debes seleccionar entre " + min + " y " + max + " respuestas"
      );
    }
  }

  function checkAnswers(index) {
    const min = props.questions[index].min;
    const max = props.questions[index].max;
    if (answers[index].length < min || answers[index].length > max) {
      setShowAlert(true);
      createMessageAlert(min, max);
      return false;
    }
    setShowAlert(false);
    return true;
  }

  return (
    <div>
      {props.questions.map((question, index) => {
        return (
          <div
            key={index}
            style={{
              display: props.actualQuestion === index ? "block" : "none",
            }}
          >
            {showAlert ? <AlertQuestions message={messageAlert} /> : <></>}
            <QuestionHeader
              actualQuestion={props.actualQuestion}
              totalQuestions={props.questions.length}
              questions={question}
            />

            <div className="box has-text-left question-box has-text-white is-flex is-justify-content-center">
              <div className="control control-box">
                <div id="">
                  {question.min_answers === 1 && question.max_answers === 1 ? (
                    <InputRadio
                      index={index}
                      addAnswer={addAnswer}
                      value={String(index)}
                      answers={question}
                    />
                  ) : (
                    <InputCheckbox
                      index={index}
                      addAnswer={addAnswer}
                      value={String(index)}
                      answers={question}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="columns pt-1 pb-4 buttons-question">
        {props.actualQuestion !== 0 &&
        props.actualQuestion < props.questions.length ? (
          <div className="column is-flex left-button-column">
            <PreviousButton
              action={() => {
                props.nextQuestion(props.actualQuestion - 1);
              }}
            />
          </div>
        ) : (
          <div className="column is-invisible is-flex left-button-column">
            <PreviousButton
              action={() => {
                props.nextQuestion(props.actualQuestion - 1);
              }}
            />
          </div>
        )}

        <div className="column is-hidden-mobile pb-0">
          <figure className="image select-img-wrapper">
            <img id="select-final-img" src={selectImg} alt="" />
          </figure>
        </div>

        {props.actualQuestion < props.questions.length - 1 && !finished ? (
          <div className="column is-flex right-button-column">
            <NextButton
              action={() => {
                if (checkAnswers(props.actualQuestion)) {
                  props.nextQuestion(props.actualQuestion + 1);
                }
              }}
            />
          </div>
        ) : (
          <div className="column is-flex right-button-column">
            <FinishButton
              action={() => {
                if (checkAnswers(props.actualQuestion)) {
                  props.encrypQuestions(answers);
                  setShowModal(true);
                  setFinished(true);
                }
              }}
              answers={answers}
            />
          </div>
        )}
      </div>
      <ModalPercentage
        booth={props.booth}
        show={showModal}
        onHide={() => setShowModal(false)}
        afterEncrypt={() => {
          props.afterEncrypt(props.booth.ballot.answers);
          setShowModal(false);
        }}
      />
    </div>
  );
}
export default Question;
