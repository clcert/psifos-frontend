import { useState } from "react";
import InputCheckbox from "./Questions/InputCheckbox";
import InputRadio from "./Questions/InputRadio";

function InputSelection(props) {
  /** @state {boolean} answers text */
  const [nullButton, setNullButton] = useState(false);

  /** @state {boolean} answers text */
  const [blankButton, setBlankButton] = useState(false);

  const [answers, setAnswers] = useState([]);

  function nullVote(event) {
    if (event.target.checked) {
      setNullButton(true);
      setAnswers([props.question.closed_options.length - 1]);
      props.addAnswer([props.question.closed_options.length - 1], props.index);
    }
  }

  function blankVote(event) {
    if (event.target.checked) {
      setBlankButton(true);
      setAnswers([props.question.closed_options.length - 2]);
      props.addAnswer([props.question.closed_options.length - 2], props.index);
    }
  }

  return (
    <div>
      <div>
        {props.question.min_answers === "1" &&
        props.question.max_answers === "1" ? (
          <InputRadio
            index={props.index}
            election={props.election}
            question={props.question}
            answers={answers}
            setAnswers={setAnswers}
            addAnswer={props.addAnswer}
            value={String(props.index)}
            setBlankButton={setBlankButton}
            setNullButton={setNullButton}
          />
        ) : (
          <InputCheckbox
            index={props.index}
            election={props.election}
            question={props.question}
            answers={answers}
            setAnswers={setAnswers}
            addAnswer={props.addAnswer}
            value={String(props.index)}
            setBlankButton={setBlankButton}
            setNullButton={setNullButton}
          />
        )}
      </div>

      {props.question.include_blank_null && (
        <>
          {" "}
          <div>
            <label id="" className={"radio question-answer pl-3 pr-2 py-2 "}>
              <input
                className="custom-answer"
                type="radio"
                id="white"
                name={"answer_" + props.index}
                checked={blankButton}
                onChange={(event) => {
                  blankVote(event);
                }}
              />
              <span className="is-size-5">Voto Blanco</span>
            </label>
          </div>
          <div>
            <label id="" className={"radio question-answer pl-3 pr-2 py-2 "}>
              <input
                className="custom-answer"
                type="radio"
                id="null"
                name={"answer_" + props.index}
                checked={nullButton}
                onChange={(event) => {
                  nullVote(event);
                }}
              />
              <span className="is-size-5">Voto Nulo</span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}

export default InputSelection;
