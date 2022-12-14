import { useState } from "react";

function InputRadio(props) {
  const [answer, setAnswer] = useState([]);
  return (

    <div>
      {props.closed_options.map((key, index) => {
        return (
          <div key={index}>
            <label
              id=""
              className={
                "radio question-answer pl-3 pr-2 py-2 " +
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
              <span className="is-size-5">{key}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
export default InputRadio;
