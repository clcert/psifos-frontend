function QuestionHeader(props) {
  const generateText = () => {
    const questions = props.questions;
    let textAux = "(seleccionar ";
    if (questions.min_answers === questions.max && questions.max_answers === 1) {
      if (questions.min_answers === 1) {
        textAux = textAux + "solo " + questions.min_answers + " opción)";
      } else {
        textAux = textAux + "solo " + questions.min_answers + " opciónes)";
      }
    }
    else if (questions.min_answers > 0) {
      textAux = textAux + "al menos " + questions.min_answers + ")";
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
        {props.questions.q_text}
      </p>
      <p className="subtitle is-italic">{generateText()}</p>
    </>
  );
}

export default QuestionHeader;
