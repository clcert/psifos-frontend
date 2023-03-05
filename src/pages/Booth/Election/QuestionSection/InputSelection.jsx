import { useState } from "react";
import InputCheckbox from "./Questions/InputCheckbox";
import InputRadio from "./Questions/InputRadio";

function InputSelection(props) {
  /** @state {boolean} answers text */
  const [nullButton, setNullButton] = useState(false);

  /** @state {boolean} answers text */
  const [blankButton, setBlankButton] = useState(false);

  const [answers, setAnswers] = useState([]);
  const isMultipleSelection =
    props.question.min_answers === "1" && props.question.max_answers === "1";

  function nullVote(event) {
    if (event.target.checked) {
      setNullButton(true);
      setBlankButton(false);
      setAnswers([props.question.closed_options.length - 1]);
      props.addAnswer([props.question.closed_options.length - 1], props.index);
    }
  }

  function blankVote(event) {
    if (event.target.checked) {
      setBlankButton(true);
      setNullButton(false);
      setAnswers([props.question.closed_options.length - 2]);
      props.addAnswer([props.question.closed_options.length - 2], props.index);
    }
  }

  return (
    <div>
      <div>
        {isMultipleSelection ? (
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
            <label
              className={
                "d-inline-flex align-items-center radio question-answer px-3 py-2 " +
                (blankButton ? "answer-selected" : "")
              }
            >
              <input
                className="custom-answer"
                type={isMultipleSelection ? "radio" : "checkbox"}
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
            <label
              className={
                "d-inline-flex align-items-center radio question-answer px-3 py-2 " +
                (nullButton ? "answer-selected" : "")
              }
            >
              <input
                className="custom-answer"
                type={isMultipleSelection ? "radio" : "checkbox"}
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
