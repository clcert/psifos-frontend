import PreviousButton from "../../../components/Buttons/PreviousButton";
import NextButton from "../../../components/Buttons/NextButton";
import FinishButton from "../../../components/Buttons/FinishButton";

function PreviousButtonBox ({
    actualQuestion,
    numQuestions,
    handleAlert,
    nextQuestion,
  }) {
    return (
      actualQuestion !== 0 &&
      actualQuestion < numQuestions && (
        <div className="column is-flex left-button-column">
          <PreviousButton
            action={() => {
              handleAlert(false);
              nextQuestion(actualQuestion - 1);
            }}
          />
        </div>
      )
    );
}

function ContinueButtonBox ({
    isNextButtonBool,
    answers,
    nextButtonHandler,
    finishButtonHandler,
    isPreview,
  }) {
    return (
      <div className="column is-flex right-button-column">
        {isNextButtonBool ? (
          <NextButton action={nextButtonHandler} />
        ) : (
          <FinishButton
            action={() => !isPreview && finishButtonHandler()}
            answers={answers}
          />
        )}
      </div>
    );
  }

export default function QuestionButtons ({
  actualQuestion, nextQuestion, answers,
  numQuestions, isPreview, handleAlert,
  showNextButton, nextButtonHandler, finishButtonHandler,
}) {
    return (
      <div className="columns pt-1 pb-4 buttons-question">
        <PreviousButtonBox
          actualQuestion={actualQuestion}
          numQuestions={numQuestions}
          handleAlert={handleAlert}
          nextQuestion={nextQuestion}
        />
        <ContinueButtonBox
          isNextButtonBool={showNextButton}
          answers={answers}
          nextButtonHandler={nextButtonHandler}
          finishButtonHandler={finishButtonHandler}
          isPreview={isPreview}
        />
      </div>
    )
}