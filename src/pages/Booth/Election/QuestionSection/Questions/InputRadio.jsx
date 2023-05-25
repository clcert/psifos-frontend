function InputRadio(props) {
  console.log(props.answers);
  function handlerInput(event) {
    props.setAnswers([parseInt(event.target.value)]);
    props.setBlankButton(false);
    props.setNullButton(false);
    props.addAnswer([parseInt(event.target.value)], props.index);
  }

  const includeBlankNull = props.question.include_blank_null === "True";

  return (
    <div>
      {props.question.closed_options.map((key, index) => {
        if (
          !includeBlankNull ||
          index < props.question.closed_options.length - 2
        )
          return (
            <div key={index} className="mt-2">
              <label
                key={index}
                className={
                  "d-inline-flex align-items-center radio question-answer question-answer-enabled px-3 py-2 " +
                  (props.answers.includes(index) ? "answer-selected" : "")
                }
              >
                <input
                  id={`question-${props.index}-answer-${index}`}
                  className="custom-answer"
                  type="radio"
                  name={"answer_" + props.index}
                  value={index}
                  onClick={handlerInput}
                />
                <span className="is-size-5">{key}</span>
              </label>
            </div>
          );
      })}
    </div>
  );
}
export default InputRadio;
