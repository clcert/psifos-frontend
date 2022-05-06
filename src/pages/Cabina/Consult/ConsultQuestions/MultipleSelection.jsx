import { useState } from "react";

function MultipleSelection(props) {
  const [questionsSelected, setQuestionsSelected] = useState([]);

  function handleChange(e) {
    const { value } = e.target;
    const { name } = e.target;
    const { checked } = e.target;

    if (checked) {
      setQuestionsSelected([...questionsSelected, value]);
    } else {
      setQuestionsSelected(
        questionsSelected.filter((question) => question !== value)
      );
    }
  }

  function isDisabled(value) {
    return (
      questionsSelected.length >= props.data.max_answers &&
      questionsSelected.indexOf(value) === -1
    );
  }
  return (
    <div className="consult-question">
      <div>
        <h1 className="consult-question-title">{props.data.text}e</h1>
      </div>

      <div>
        <p className="consult-question-description">{props.data.q_description}</p>
      </div>
      <div className="mb-3">
        <span className="consult-question-info">
          • debes seleccionar {props.data.min_answers} a{" "}
          {props.data.max_answers} opciones
        </span>
      </div>

      <div className="">
        {props.data.closed_options.map((key, index) => {
          return (
            <div key={index} className="consult-answer p-2">
              <label>
                <input
                  type="checkbox"
                  name="question"
                  value={key}
                  onChange={handleChange}
                  disabled={isDisabled(key)}
                  className="mr-2"
                />
                <span className="">{key}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MultipleSelection;
