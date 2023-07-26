import { answersRestrictionText } from './utils.js'

function QuestionHeader(props) {

  const questions = props.questions;
  const restriction = answersRestrictionText(questions.min_answers,questions.max_answers )

  return (
    <div>
      <p className="subtitle is-italic mb-0">
        {"Pregunta " +
          (props.actualQuestion + 1) +
          " de " +
          props.totalQuestions}
      </p>
      <p className="title is-4 has-text-black pt-6">{props.questions.q_text}</p>
      <p className="subtitle is-italic">{"(" + restriction + ")" }</p>
      {props.questions.q_description && (
        <p className="subtitle is-italic">{props.questions.q_description}</p>
      )}
    </div>
  );
}

export default QuestionHeader;
