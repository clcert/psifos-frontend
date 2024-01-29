import { useState, useEffect } from "react";
import selectImg from "../../../../static/booth/svg/select-img.svg";
import FinishButton from "../../components/Buttons/FinishButton";
import NextButton from "../../components/Buttons/NextButton";
import PreviousButton from "../../components/Buttons/PreviousButton";
import QuestionHeader from "./QuestionHeader";
import ModalPercentage from "../../components/ModalPercentage";
import AlertQuestions from "./Questions/AlertQuestions";
import MixnetSelection from "./MixnetSelection";
import { answersRestrictionText } from "./utils.js";
import {
  permanentOptionsList, preferentialRankingTallyNames,
} from "../../../../constants";
import {
  isMixNetQuestion, isClosedQuestion, isSTVQuestion,
} from "../../../../utils";
import RankingSelection from "./RankingSelection";
import InputSelection from "./InputSelection";

const getDefaultAnswer = (currentQuestion) => {
  const getEmptyArray = (_) => []
  const defaultAnswer = {
    "stvnc_question": (actualQuestion) => {
      return actualQuestion.closed_options.reduce(
        (accumulator, _, index) => {
          return [...accumulator, index]
        }, []
    )},
    "mixnet_question": getEmptyArray,
    "closed_question": getEmptyArray,
  }
  return defaultAnswer[currentQuestion.q_type](currentQuestion)
}

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
          {isSTVQuestion(question.q_type) && (
            <RankingSelection {...selectionProps} />
          )}
          {isClosedQuestion(question.q_type) && (
            <InputSelection {...selectionProps} />
          )}
          {isMixNetQuestion(question.q_type) && (
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


function ContinueButtonBox({
  isNextButtonBool, answers,
  nextButtonHandler, finishButtonHandler,
  isPreview,
}) {
  return (
    <div className="column is-flex right-button-column">
      {isNextButtonBool ? (
        <NextButton
          action={nextButtonHandler}
        />
      ) : (
        <FinishButton
          action={() => !isPreview && finishButtonHandler()}
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
     * Default arrays are included in each response
     */
    let answersAux = props.questions.reduce(
      (accumulator, currentValue, index) => {
        accumulator[index] = getDefaultAnswer(currentValue)
        return accumulator
    }, []);
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
    return !preferentialRankingTallyNames.includes(
      currentQuestion.tally_type
    ) ? checkNumAnswers(
      numCheckedIndex, options, checkedIndex, currentQuestion,
    ) : true
  }

  const checkNumAnswers = (
    numCheckedIndex, options, checkedIndex, currentQuestion,
  ) => {
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
          isPreview={props.isPreview}
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
