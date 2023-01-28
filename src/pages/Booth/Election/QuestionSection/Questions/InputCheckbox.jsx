function InputCheckbox(props) {
  function addAnswer(event, index) {
    let value = parseInt(event.target.value);
    let answersAux = [...props.answers];

    const questionsLength = props.question.closed_options.length;
    if (
      props.question.include_blank_null &&
      (answersAux.includes(questionsLength - 2) ||
        answersAux.includes(questionsLength - 1))
    ) {
      props.setBlankButton(false);
      props.setNullButton(false);
      answersAux = [];
    }

    if (event.target.checked && !props.answers.includes(value)) {
      answersAux.push(value);
    } else if (!event.target.checked && props.answers.includes(value)) {
      answersAux.splice(answersAux.indexOf(value), 1);
    }
    props.setAnswers(answersAux);
    return answersAux;
  }

  return (
    <div>
      {props.question.closed_options.map((key, index) => {
        if (
          !props.question.include_blank_null ||
          index < props.question.closed_options.length - 2
        ) {
          return (
            <div key={index}>
              <label
                className={
                  "checkbox question-answer pl-3 p-2 " +
                  (props.answers.includes(index) ? "answer-selected" : "")
                }
              >
                <input
                  type="checkbox"
                  className="ballot_answer custom-answer"
                  value={index}
                  checked={props.answers.includes(index) || false}
                  onChange={(e) => {
                    let ans = addAnswer(e, props.index);
                    props.addAnswer(ans, props.index);
                  }}
                />
                <span className="is-size-5">{key}</span>
              </label>
            </div>
          );
        }
      })}
    </div>
  );
}

export default InputCheckbox;
