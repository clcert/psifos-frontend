function UniqueSelection(props) {
  return (
    <div className="consult-question">
      <div>
        <h1 className="consult-question-title">Pregunta Selección Única</h1>
      </div>

      <div>
        <p className="consult-question-description">{props.data.description}</p>
      </div>
      <div className="mb-3">
        <span className="consult-question-info">
        • debes seleccionar solo 1 opción
        </span>
      </div>

      {Object.keys(props.data.answers).map((key, index) => {
        return (
          <div className="consult-answer p-2">
            <label>
              <input type="radio" name="question" value="1" className="mr-2" />
              <span >{props.data.answers[key]}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
export default UniqueSelection;
