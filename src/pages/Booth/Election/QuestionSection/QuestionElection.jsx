import { useState, useEffect, useCallback } from "react";
import selectImg from "../../../../static/booth/svg/select-img.svg";
import FinishButton from "../../components/Buttons/FinishButton";
import NextButton from "../../components/Buttons/NextButton";
import PreviousButton from "../../components/Buttons/PreviousButton";
import QuestionHeader from "./QuestionHeader";
import ModalPercentage from "../../components/ModalPercentage";
import AlertQuestions from "./Questions/AlertQuestions";
import MixnetSelection from "./MixnetSelection";
import { answersRestrictionText } from "./utils.js";
import { permanentOptionsList } from "../../../../constants";
import RankingSelection from "./RankingSelection";
import InputSelection from "./InputSelection";

function QuestionSelectionBox({
  question, index, showAlert, messageAlert,
  totalQuestions, addAnswer, election,
}) {
  const selectionProps = {
    index: index,
    addAnswer: addAnswer,
    question: question,
    election: election,
  }

  return (
    <div
      key={index}
      style={{ display: "block" }}
    >
      {showAlert && <AlertQuestions message={messageAlert} />}
      <QuestionHeader
        actualQuestion={index}
        totalQuestions={totalQuestions}
        questions={question}
      />

      <div className="box has-text-left question-box has-text-white is-flex is-justify-content-center mb-3">
        <div className="control control-box">
          {question.q_type === "stvnc_question" && (
            <RankingSelection {...selectionProps} />
          )}
          {question.q_type === "closed_question" && (
            <InputSelection {...selectionProps} />
          )}
          {question.q_type === "mixnet_question" && (
            <MixnetSelection numQuestion={index} {...selectionProps} />
          )}
        </div>
      </div>
    </div>
  )
}

function PreviousButtonBox({
  actualQuestion, numQuestions, handleAlert, nextQuestion,
}) {
  return (
    actualQuestion !== 0 && actualQuestion < numQuestions && (
      <div className="column is-flex left-button-column">
        <PreviousButton
          action={() => {
            handleAlert(false);
            nextQuestion(actualQuestion - 1);
          }}
        />
      </div>
    )
  )
}

function SelectFigureBox() {
  return (
    <div className="column is-hidden-mobile pb-0">
      <figure className="image select-img-wrapper">
        <img id="select-final-img" src={selectImg} alt="" />
      </figure>
    </div>
  )
}

function ContinueButtonBox({
  isNextButtonBool, answers,
  nextButtonHandler, finishButtonHandler,
}) {
  return (
    <div className="column is-flex right-button-column">
      {isNextButtonBool ? (
        <NextButton
          action={nextButtonHandler}
        />
      ) : (
        <FinishButton
          action={finishButtonHandler}
          answers={answers}
        />
      )}
    </div>
  )
}

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
      {props.questions[props.actualQuestion] && (
        <QuestionSelectionBox
          question={props.questions[props.actualQuestion]}
          index={props.actualQuestion}
          showAlert={showAlert}
          messageAlert={messageAlert}
          totalQuestions={props.questions.length}
          addAnswer={(answer, index) => {
            let answersAux = [...answers];
            answersAux[index] = answer;
            setAnswers(answersAux);
          }}
          election={props.election}
        />
      )}

      <div className="columns pt-1 pb-4 buttons-question">
        <PreviousButtonBox
          actualQuestion={props.actualQuestion}
          numQuestions={props.questions.length}
          handleAlert={setShowAlert}
          nextQuestion={props.nextQuestion}
        />

        <SelectFigureBox />

        <ContinueButtonBox
          isNextButtonBool={ props.actualQuestion < props.questions.length - 1 && !finished }
          answers={answers}
          nextButtonHandler={() => {
            if (checkAnswers(props.actualQuestion)) {
              props.nextQuestion(props.actualQuestion + 1);
            }
          }}
          finishButtonHandler={() => {
            if (checkAnswers(props.actualQuestion)) {
              props.encrypQuestions(answers);
              setShowModal(true);
              setFinished(true);
            }
          }}
        />
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
