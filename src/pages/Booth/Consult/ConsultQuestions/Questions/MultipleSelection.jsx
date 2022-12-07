import { useState } from "react";

function MultipleSelection(props) {
  const [questionsSelected, setQuestionsSelected] = useState([]);
  const [otherChecked, setOtherChecked] = useState(false);

  function handleChange(e) {
    const { value } = e.target;
    const { checked } = e.target;
    let questionsSelectedAux = [...questionsSelected];
    if (checked) {
      questionsSelectedAux.push(parseInt(value));
    } else {
      questionsSelectedAux.splice(questionsSelectedAux.indexOf(value), 1);
    }
    setQuestionsSelected(questionsSelectedAux);
    props.addAnswer(questionsSelectedAux, props.index);
  }

  function isDisabled(value) {
    return (
      questionsSelected.length >= props.data.max_answers &&
      questionsSelected.indexOf(value) === -1 &&
      !questionsSelected[questionsSelected.indexOf(value)]
    );
  }
  return (
    <div className="consult-question">
      <div>
        <h1 className="consult-question-title">{props.data.text}e</h1>
      </div>

      <div>
        <p className="consult-question-description">
          {props.data.q_description}
        </p>
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
                  value={index}
                  onChange={handleChange}
                  disabled={isDisabled(index)}
                  className="mr-2"
                />
                <span className="">{key}</span>
              </label>
            </div>
          );
        })}
        {props.data.q_type === "open_question" && (
          <>
            <div className="consult-answer p-2">
              <label>
                <input
                  type="checkbox"
                  name="question"
                  value="other"
                  className="mr-2"
                  onChange={(e) => {
                    setOtherChecked(e.target.checked);
                  }}
                />
                <span>Otro</span>
              </label>
            </div>
            {otherChecked &&
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
    </div>
  );
}

export default MultipleSelection;
