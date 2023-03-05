import { useState } from "react";

function InputRadio(props) {
  function handlerInput(event) {
    props.setAnswers([parseInt(event.target.value)]);
    props.setBlankButton(false);
    props.setNullButton(false);
    props.addAnswer([parseInt(event.target.value)], props.index);
  }

  return (
    <div>
      {props.question.closed_options.map((key, index) => {
        if (
          !props.question.include_blank_null ||
          index < props.question.closed_options.length - 2
        )
          return (
            <div key={index}>
              <label
                key={index}
                className={
                  "d-inline-flex align-items-center radio question-answer px-3 py-2 " +
                  (props.answers.includes(index) ? "answer-selected" : "")
                }
              >
                <input
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
