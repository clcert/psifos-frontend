import { useSelector } from "react-redux";
export function OptionInputRadio({
  optionId,
  questionId,
  optionLabel,
  isSelected,
  inputHandler,
  isBordered = false,
}) {
  return (
    <div key={optionId} className="mt-2">
      <label
        key={optionId}
        className={
          "d-inline-flex align-items-center radio question-answer question-answer-enabled px-3 py-2 " +
          (isSelected ? "answer-selected" : "")
        }
      >
        <input
          id={`question-${questionId}-answer-${optionId}`}
          className="custom-answer"
          type="radio"
          name={"answer_" + questionId}
          value={optionId}
          onClick={inputHandler}
        />
        <span className="is-size-5">{optionLabel}</span>
      </label>
    </div>
  );
}

function InputRadio({
  setAnswers,
  setBlankButton,
  setNullButton,
  addAnswer,
  question,
  questionId,
}) {
  const { include_blank_null } = question;
  const includeInformalAns = include_blank_null === "True";
  const closed_options = JSON.parse(question.closed_options);

  let answers = useSelector((state) => state.booth.answers)[questionId];
  answers = answers ? answers : [];

  function handlerInput(event) {
    addAnswer([parseInt(event.target.value)], questionId);
  }
  return (
    <div>
      {closed_options.map((key, index) => {
        if (!includeInformalAns || index < closed_options.length - 2)
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
