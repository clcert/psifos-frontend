import { useState } from "react";

function InputRadio(props) {
  const [answer, setAnswer] = useState([]);

  return (
    <div>
      {Object.keys(props.answers.answers).map((key, index) => {
        return (
          <div key={index}>
            <label
              id=""
              className={
                "radio question-answer p-2 " +
                (answer.includes(index) ? "answer-selected" : "")
              }
            >
              <input
                className="custom-answer"
                type="radio"
                id=""
                name="answer"
                value={index}
                onClick={(e) => {
                  setAnswer(e.target.value);
                  props.addAnswer([parseInt(e.target.value)], props.index);
                }}
              />
              <span className="is-size-4">{props.answers.answers[key]}</span>
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
export default InputRadio;
