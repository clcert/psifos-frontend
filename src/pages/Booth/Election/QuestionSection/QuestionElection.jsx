import { useState, useEffect, useCallback } from "react";
import selectImg from "../../../../static/booth/svg/select-img.svg";
import FinishButton from "../../components/Buttons/FinishButton";
import NextButton from "../../components/Buttons/NextButton";
import PreviousButton from "../../components/Buttons/PreviousButton";
import QuestionHeader from "./QuestionHeader";
import ModalPercentage from "../../components/ModalPercentage";
import AlertQuestions from "./Questions/AlertQuestions";
import MixnetSelection from "./MixnetSelection";
import InputSelection from "./InputSelection";
import { answersRestrictionText } from "./utils.js";
import { permanentOptionsList } from "../../../../constants";
import RankingSelection from "./RankingSelection";

function QuestionElection(props) {
  /** Component for election questions */

  /** @state {array} election answers */
  const [answers, setAnswers] = useState([]);

  /** @state {boolean} percentage modal state */
  const [showModal, setShowModal] = useState(false);

  /** @state {boolean} encryption status */
  const [finished, setFinished] = useState(false);

  /** @state {boolean} alert status */
  const [showAlert, setShowAlert] = useState(false);

  /** @state {string} feedback message of alert */
  const [messageAlert, setMessageAlert] = useState("");

  function addAnswer(answer, index) {
    /**
     * @param {array} answersAux - consult answers
     * @param {number} index - question index
     *
     * include the responses in the response array for encryption
     */
    let answersAux = [...answers];
    answersAux[index] = answer;
    setAnswers(answersAux);
  }

  useEffect(() => {
    /**
     * Empty arrays are included in each response
     */
    let answersAux = [];
    props.questions.forEach((actualQuestion, index) => {
      let auxArray = [];
      answersAux[index] = auxArray;
    });
    setAnswers(answersAux);
  }, [props.questions]);

  const checkAnswers = (index) => {
    /**
     * @param {number} index - question index
     * Check if the number of answers is correct
     * If not, show the alert
     */
    const { questions } = props;
    const currentQuestion = questions[index];
    const checkedIndex = answers[index];
    const numCheckedIndex = checkedIndex.length;
    const options = currentQuestion.closed_options;

    if (
      !Boolean(
        numCheckedIndex === 1 &&
          permanentOptionsList.includes(options[checkedIndex[0]])
      )
    ) {
      const { min_answers, max_answers } = currentQuestion;
      if (numCheckedIndex < min_answers || numCheckedIndex > max_answers) {
        setShowAlert(true);
        setMessageAlert(
          "Debe " + answersRestrictionText(min_answers, max_answers)
        );
        return false;
      }
    }
    setShowAlert(false);
    return true;
  };

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
            {showAlert && <AlertQuestions message={messageAlert} />}
            <QuestionHeader
              actualQuestion={props.actualQuestion}
              totalQuestions={props.questions.length}
              questions={question}
            />

            <div className="box has-text-left question-box has-text-white is-flex is-justify-content-center mb-3">
              <div className="control control-box">
                {question.q_type === "closed_question" && (
                  <RankingSelection
                    index={index}
                    addAnswer={addAnswer}
                    question={question}
                    election={props.election}
                  />
                )}
                {question.q_type === "mixnet_question" && (
                  <MixnetSelection
                    numQuestion={index}
                    addAnswer={addAnswer}
                    question={question}
                    election={props.election}
                  />
                )}
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
                setShowAlert(false);
                props.nextQuestion(props.actualQuestion - 1);
              }}
            />
          </div>
        ) : (
          <div className="column is-invisible is-flex left-button-column">
            <PreviousButton
              action={() => {
                setShowAlert(false);
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
export default QuestionElection;
