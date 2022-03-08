import { useState } from "react";

function InputCheckbox(props) {
  const [answers, setAnswers] = useState([]);

  function addAnswer(event, index) {
    let value = parseInt(event.target.value);
    if (event.target.checked && !answers.includes(value)) {
      let answersAux = [...answers];
      answersAux.push(value);
      setAnswers(answersAux);
      console.log(answersAux)
    } else if (!event.target.checked && answers.includes(value)) {
      let answersAux = [...answers];
      answersAux.splice(answersAux.indexOf(value), 1);
      setAnswers(answersAux);
      console.log(answersAux)
    }
  }

  return (
    <div>
      {Object.keys(props.answers.answers).map((key, index) => {
        return (
          <div key={index}>
            <label id="" className="checkbox question-answer p-2">
              <input
                type="checkbox"
                className="ballot_answer custom-answer"
                id=""
                name=""
                value={index}
                onClick={(e) => {
                  addAnswer(e, props.index);
                  props.addAnswer(answers, props.index);
                }}
              />
              <span className="is-size-4">{props.answers.answers[key]}</span>
              &nbsp;&nbsp;
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
            </label>
          </div>
        );
      })}
    </div>
  );
}

export default InputCheckbox;
