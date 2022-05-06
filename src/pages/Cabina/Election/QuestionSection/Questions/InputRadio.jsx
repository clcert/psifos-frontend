import { useState } from "react";

function InputRadio(props) {
  const [answer, setAnswer] = useState([]);
  return (

    <div>
      {props.answers.closed_options.map((key, index) => {
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
                name={"answer_"+props.index}
                value={index}
                onClick={(e) => {
                  setAnswer(e.target.value);
                  props.addAnswer([parseInt(e.target.value)], props.index);
                }}
              />
              <span className="is-size-4">{key}</span>
              &nbsp;&nbsp;
              {key !== "" ? (
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
