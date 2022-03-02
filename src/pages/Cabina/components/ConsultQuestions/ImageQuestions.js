function ImageQuestions(props) {
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

      <div className="columns is-multiline">
        {Object.keys(props.data.answers).map((key, index) => {
          return (
            <div className="column is-half">
              <div className="control">
                <figure className="image is-3by2 query-question-answer-image">
                  <img src="https://wallpapercave.com/wp/wp4574719.jpg" />
                </figure>
                <label>
                  <input
                    type="radio"
                    name="question"
                    value="1"
                    className="mr-2"
                  />
                  <span>{props.data.answers[key]}</span>
                </label>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ImageQuestions;
