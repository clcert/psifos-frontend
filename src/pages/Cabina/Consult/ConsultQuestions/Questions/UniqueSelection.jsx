import { useState } from "react";

function UniqueSelection(props) {
  const [actualAnswers, setActualAnswers] = useState("");

  return (
    <div className="consult-question">
      <div>
        <h1 className="consult-question-title">{props.data.q_text}</h1>
      </div>

      <div>
        <p className="consult-question-description">
          {props.data.q_description}
        </p>
      </div>
      <div className="mb-3">
        <span className="consult-question-info">
          • debes seleccionar solo 1 opción
        </span>
      </div>

      {props.data.closed_options.map((key, index) => {
        return (
          <div key={index} className="consult-answer p-2">
            <label>
              <input
                type="radio"
                name="question"
                value={index}
                className="mr-2"
                onChange={(e) => {
                  setActualAnswers(e.target.value);
                  props.addAnswer([parseInt(e.target.value)], props.index);
                }}
              />
              <span>{key}</span>
            </label>
          </div>
        );
      })}
      {props.data.q_type === "open_question" && (
        <>
          <div className="consult-answer p-2">
            <label>
              <input
                type="radio"
                name="question"
                value="other"
                className="mr-2"
                onChange={(e) => {
                  setActualAnswers(e.target.value);
                }}
              />
              <span>Otro</span>
            </label>
          </div>
          {actualAnswers === "other" &&
            [...Array(props.data.total_open_options).keys()].map(
              (key, index) => {
                return (
                  <div key={index} className="consult-answer p-2">
                    <label>
                      <input
                        type="text"
                        name="question"
                        value=""
                        className="input mr-2"
                        placeholder={"Opción " + (key + 1)}
                      />
                    </label>
                  </div>
                );
              }
            )}
        </>
      )}
    </div>
  );
}
export default UniqueSelection;
