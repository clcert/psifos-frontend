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
      questionsSelected.length >= props.data.maxSelection &&
      questionsSelected.indexOf(value) === -1
    );
  }
  console.log(questionsSelected);
  return (
    <div className="consult-question">
      <div>
        <h1 className="consult-question-title">Pregunta Selección Multiple</h1>
      </div>

      <div>
        <p className="consult-question-description">{props.data.description}</p>
      </div>
      <div className="mb-3">
        <span className="consult-question-info">
          • debes seleccionar {props.data.minSelection} a{" "}
          {props.data.maxSelection} opciones
        </span>
      </div>

      <div className="">
        {Object.keys(props.data.answers).map((key, index) => {
          return (
            <div className="consult-answer p-2">
              <label>
                <input
                  type="checkbox"
                  name="question"
                  value={key}
                  onChange={handleChange}
                  disabled={isDisabled(key)}
                  className="mr-2"
                />
                <span className="">{props.data.answers[key]}</span>
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MultipleSelection;
