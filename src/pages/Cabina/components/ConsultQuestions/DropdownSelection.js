function DropdownSelection(props) {
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

      <select className="select-consult">
        <option className="option-consult" value="">Selecciona una opción</option>
        {Object.keys(props.data.answers).map((key, index) => {
          return (
            <option name="question" value={key}>
              {props.data.answers[key]}
            </option>
          );
        })}
      </select>
    </div>
  );
}

export default DropdownSelection;
