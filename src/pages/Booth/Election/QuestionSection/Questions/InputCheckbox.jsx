function InputCheckbox(props) {
  const disabledCondition = (index) => {
    return (
      parseInt(props.question.max_answers) === props.answers.length &&
      !props.answers.includes(index)
    );
  };

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
          const isDesabled = disabledCondition(index);
          return (
            <div key={index} className={"mt-2 "}>
              <label
                className={
                  (isDesabled
                    ? "question-answer-desabled "
                    : "question-answer-enabled ") +
                  "d-inline-flex align-items-center checkbox question-answer px-3 py-2 " +
                  (props.answers.includes(index) ? "answer-selected" : "")
                }
              >
                <input
                  id={`question-${props.index}-answer-${index}`}
                  type="checkbox"
                  className="custom-answer"
                  name={"answer_" + index}
                  value={index}
                  checked={props.answers.includes(index) || false}
                  onChange={(e) => {
                    let ans = addAnswer(e, props.index);
                    props.addAnswer(ans, props.index);
                  }}
                  disabled={isDesabled}
                />
                <span className={"is-size-5"}> {key} </span>
              </label>
            </div>
          );
        }
      })}
    </div>
  );
}

export default InputCheckbox;
