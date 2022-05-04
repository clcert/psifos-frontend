import { useState } from "react";

function InputCheckbox(props) {
  const [answers, setAnswers] = useState([]);

  function addAnswer(event, index) {
    let value = parseInt(event.target.value);
    let answersAux = [...answers];
    if (event.target.checked && !answers.includes(value)) {
      answersAux.push(value);
      setAnswers(answersAux);
    } else if (!event.target.checked && answers.includes(value)) {
      answersAux.splice(answersAux.indexOf(value), 1);
      setAnswers(answersAux);
    }
    return answersAux;
  }

  return (
    <div>
      {Object.keys(props.answers.answers).map((key, index) => {
        return (
          <div key={index}>
            <label
              id=""
              className={
                "checkbox question-answer p-2 " +
                (answers.includes(index) ? "answer-selected" : "")
              }
            >
              <input
                type="checkbox"
                className="ballot_answer custom-answer"
                id=""
                name=""
                value={index}
                onClick={(e) => {
                  let ans = addAnswer(e, props.index);
                  props.addAnswer(ans, props.index);
                }}
              />
              <span className="is-size-4">{props.answers.answers[key].value}</span>
              &nbsp;&nbsp;
              {props.answers.answer_urls[key] !== "" ? (
                <span style={{ fontSize: "12pt" }}>
                  [
                  <a
                    target="_blank"
                    href="{$T.question.answer_urls[$T.answer_ordering[$T.answer$index]]}"
                    rel="noopener noreferrer"
                  >
                    more info
                  </a>
                  ]
                </span>
              ) : (
                <></>
              )}
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default InputCheckbox;