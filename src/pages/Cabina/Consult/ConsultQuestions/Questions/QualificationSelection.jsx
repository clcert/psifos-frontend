import { useState } from "react";

function QuealificationSelection(props) {
  const [maxQualification, setMaxQualification] = useState(5);
  return (
    <div className="consult-question">
      <div>
        <h1 className="consult-question-title">Pregunta con Dropdown</h1>
      </div>

      <div>
        <p className="consult-question-description">{props.data.description}</p>
      </div>
      <div className="mb-3">
        <span className="consult-question-info">
          • debes seleccionar solo 1 opción
        </span>
      </div>

      <div className="consult-answer p-0 ">
        <div className="is-flex is-justify-content-space-evenly query-question-answer-grade my-2">
          <p className="query-question-grade-label">Minimo</p>

          {[...Array(maxQualification).keys()].map((key, index) => {
            return (
              <div className="control">
                <label className="radio is-flex is-flex-direction-column-reverse">
                  <input
                    className="quealification-radio"
                    type="radio"
                    name="question"
                    value={key + 1}
                  ></input>
                  <p className="is-align-self-center pb-2">{key + 1}</p>
                </label>
              </div>
            );
          })}

          <p className="query-question-grade-label">Maximo</p>
        </div>
      </div>
    </div>
  );
}

export default QuealificationSelection;
