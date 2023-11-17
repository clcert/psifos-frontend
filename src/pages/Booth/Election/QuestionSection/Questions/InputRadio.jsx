export function OptionInputRadio({
  optionId, questionId, optionLabel,
  isSelected, inputHandler, isBordered=false,
}) {
  return (
    <div
      key={optionId}
      className={`mt-2 ${isBordered && "is-bordered"}`}
    >
      <label
        key={optionId}
        className={
          "d-inline-flex align-items-center radio " +
          "question-answer question-answer-enabled px-3 py-2 " +
          `${isSelected && (
            `radio-button-selected ${
              !isBordered && "is-bordered"
            }`
          )} `
        }
      >
        <input
          id={`question-${questionId}-answer-${optionId}`}
          className="custom-answer"
          type="radio"
          name={"answer_" + questionId}
          value={optionId}
          onClick={inputHandler}
          checked={isSelected}
        />
        <span className="is-size-5">{optionLabel}</span>
      </label>
    </div>
  )
}


function InputRadio({
  setAnswers, setBlankButton, setNullButton,
  addAnswer, question, answers, questionId,
}) {

  const { include_blank_null, closed_options } = question
  const includeInformalAns = include_blank_null === "True";

  function handlerInput(event) {
    const { target } = event
    const { value } = target
    setAnswers([parseInt(value)]);
    setBlankButton(false);
    setNullButton(false);
    addAnswer([parseInt(value)], questionId);
  }

  return (
    <div>
      {closed_options.map((key, index) => {
        if (
          !includeInformalAns || index < closed_options.length - 2
        )
          return (
            <OptionInputRadio
              optionId={index}
              questionId={questionId}
              optionLabel={key}
              isSelected={answers.includes(index)}
              inputHandler={handlerInput}
            />
          );
        else return null;
      })}
    </div>
  );
}
export default InputRadio;
