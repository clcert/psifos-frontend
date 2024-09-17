import { answersRestrictionText } from '../utils.js'
import { isSTVQuestion } from '../../../../../utils.js';

function urlifyDescription(text) {
  var urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(urlRegex, function(url) {
    return '<a target="_blank" href="' + url + '">' + url + '</a>';
  })
}

function Description ({q_description}) {
  const description_with_url = urlifyDescription(q_description)
  return (
    q_description && (
      <p
        dangerouslySetInnerHTML={{ __html: description_with_url }}
        className="subtitle is-italic"
      />
    )
  )
}

function QuestionNumber ({
  currentQuestion, totalQuestions
}) {
  return (
    <p className="subtitle is-italic mb-0">
      {
        "Pregunta " + currentQuestion +
        " de " + totalQuestions
      }
    </p>
  )
}

function Title({title}) {
  return (
    <p className="title is-4 has-text-black pt-6">
      {title}
    </p>
  )
}

function Restriction ({
  min_answers, max_answers, q_type,
}) {
  const init = isSTVQuestion(q_type) ? "ordenar" : undefined
  const restriction = answersRestrictionText(
    min_answers, max_answers, init
  )
  return (
    <p className="subtitle is-italic">
      {"(" + restriction + ")" }
    </p>
  )
}

function QuestionHeader({
  questions, actualQuestion, totalQuestions,
}) {
  const {
    min_answers, max_answers,
    q_description, q_text,
    q_type,
  } = questions

  return (
    <div>
      <QuestionNumber
        currentQuestion={actualQuestion + 1}
        totalQuestions={totalQuestions}
      />
      <Title
        title={q_text}
      />
      <Restriction
        min_answers={min_answers}
        max_answers={max_answers}
        q_type={q_type}
      />
      <Description
        q_description={q_description}
      />
    </div>
  );
}

export default QuestionHeader;
