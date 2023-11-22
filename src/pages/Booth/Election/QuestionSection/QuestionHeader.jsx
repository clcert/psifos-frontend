import { answersRestrictionText } from './utils.js'

function urlifyDescription(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a target="_blank" href="' + url + '">' + url + '</a>';
  })
}

function QuestionHeader(props) {

  const questions = props.questions;
  const restriction = answersRestrictionText(questions.min_answers,questions.max_answers)
  const description_with_url = urlifyDescription(props.questions.q_description)

  return (
    <div>
      <p className="subtitle is-italic mb-0">
        {"Pregunta " +
          (props.actualQuestion + 1) +
          " de " +
          props.totalQuestions}
      </p>
      <p className="title is-4 has-text-black pt-6">{props.questions.q_text}</p>
      {props.questions.tally_type !== "stvnc" && (
        <p className="subtitle is-italic">{"(" + restriction + ")" }</p>
      )}
      {props.questions.q_description && (
        <p dangerouslySetInnerHTML={{ __html: description_with_url }} className="subtitle is-italic">
        </p>
      )}
    </div>
  );
}

export default QuestionHeader;
