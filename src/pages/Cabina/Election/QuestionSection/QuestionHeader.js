function QuestionHeader(props) {
  const generateText = () => {
    const questions = props.questions;
    let textAux = "(seleccionar ";
    if (questions.min === questions.max && questions.max === 1) {
      if (questions.min === 1) {
        textAux = textAux + "solo " + questions.min + " opción)";
      } else {
        textAux = textAux + "solo " + questions.min + " opciónes)";
      }
    }
    else if (questions.min > 0) {
      textAux = textAux + "al menos " + questions.min + ")";
    } else {
      textAux = textAux + "cuantos quieras)";
    }
    return textAux;
  };

  return (
    <>
      <p className="subtitle is-italic mb-0">
        {"Pregunta " +
          (props.actualQuestion + 1) +
          " de " +
          props.totalQuestions}
      </p>
      <p className="title is-4 has-text-black pt-6">
        {props.questions.question}
      </p>
      <p className="subtitle is-italic">{generateText()}</p>
    </>
  );
}

export default QuestionHeader;
