function AgroupQuestions(props) {
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
      <div className="consult-agroup">
        <div className="columns" style={{ marginBottom: "-1rem" }}>
          <div className="column"></div>
          {Object.keys([...Array(5).keys()]).map((key, index) => {
            return (
              <div className="column query-question-group-options">
                <p>Opción {index + 1}</p>
              </div>
            );
          })}
        </div>

        {Object.keys(props.data.answers).map((key1, index1) => {
          return (
            <div className="consult-answer mb-4">
              <div className="columns is-vcentered query-question-answer">
                <div className="column ml-2">{props.data.answers[key1]}</div>
                {Object.keys([...Array(5).keys()]).map((key1, index2) => {
                  return (
                    <div className="column is-align-self-center is-vcentered">
                      <div className="control">
                        <label className="radio is-flex is-justify-content-center">
                          <input
                            className=""
                            type="radio"
                            name={"question_" + index1}
                            value={index2 + 1}
                          ></input>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AgroupQuestions;
