import { useState } from "react";
import InputCheckbox from "./Questions/InputCheckbox";
import InputRadio from "./Questions/InputRadio";
import { permanentOptions } from "../../../../constants";

function InputSelection(props) {
  /** @state {boolean} answers text */
  const [nullButton, setNullButton] = useState(false);

  /** @state {boolean} answers text */
  const [blankButton, setBlankButton] = useState(false);

  const [answers, setAnswers] = useState([]);
  const isMultipleSelection =
    props.question.min_answers === "1" && props.question.max_answers === "1";

  const nullValue = props.question.closed_options.length - 1;
  const blankValue = props.question.closed_options.length - 2;

  const {whiteOptionText, nullOptionText} = permanentOptions

  function nullVote(event) {
    if (event.target.checked) {
      const value = parseInt(event.target.value);
      setNullButton(true);
      setBlankButton(false);
      setAnswers([value]);
      props.addAnswer([value], props.index);
    } else {
      setNullButton(false);
      setAnswers([]);
      props.addAnswer([], props.index);
    }
  }

  function blankVote(event) {
    if (event.target.checked) {
      const value = parseInt(event.target.value);
      setBlankButton(true);
      setNullButton(false);
      setAnswers([value]);
      props.addAnswer([value], props.index);
    } else {
      setBlankButton(false);
      setAnswers([]);
      props.addAnswer([], props.index);
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
          <div className="mt-2">
            <label
              className={
                "d-inline-flex align-items-center radio question-answer question-answer-enabled px-3 py-2 " +
                (blankButton ? "answer-selected" : "")
              }
            >
              <input
                className="custom-answer"
                type={isMultipleSelection ? "radio" : "checkbox"}
                id="white"
                value={blankValue}
                name={"answer_" + props.index}
                checked={blankButton}
                onChange={(event) => {
                  blankVote(event);
                }}
              />
              <span className="is-size-5"> {whiteOptionText} </span>
            </label>
          </div>
          <div className="mt-2">
            <label
              className={
                "d-inline-flex align-items-center radio question-answer question-answer-enabled px-3 py-2 " +
                (nullButton ? "answer-selected" : "")
              }
            >
              <input
                className="custom-answer"
                type={isMultipleSelection ? "radio" : "checkbox"}
                id="null"
                value={nullValue}
                name={"answer_" + props.index}
                checked={nullButton}
                onChange={(event) => {
                  nullVote(event);
                }}
              />
              <span className="is-size-5"> {nullOptionText} </span>
            </label>
          </div>
        </>
      )}
    </div>
  );
}

export default InputSelection;
