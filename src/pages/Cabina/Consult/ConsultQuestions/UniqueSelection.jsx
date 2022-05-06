function UniqueSelection(props) {
  return (
    <div className="consult-question">
      <div>
        <h1 className="consult-question-title">{props.data.q_text}</h1>
      </div>

      <div>
        <p className="consult-question-description">{props.data.q_description}</p>
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
              <input type="radio" name="question" value="1" className="mr-2" />
              <span>{key}</span>
            </label>
          </div>
        );
      })}
    </div>
  );
}
export default UniqueSelection;
