import React from "react";

function ShowAnswer({
  questionType, indexAnswer, numOptions,
  index, answer,
}) {
  return (
    (
      !(questionType === "mixnet_question")
      || indexAnswer < numOptions - 2
    ) && (
      <React.Fragment key={index}>
        <span key={index}>
          {(
            questionType === "stvnc_question"
            ? `[${index+1}.] `
            : "[ ✓ ] "
          ) + (
            questionType === "mixnet_question" && answer.split(",").length > 1
            ? answer.split(",")[0]
            : answer
          )}
        </span>
        <br />
      </React.Fragment>
    )
  )
}

function ShowAnswersList({
  currentAns, questionType, closedOptions,
}) {
  return (
    <p className="mb-0">
      {currentAns.map((key, index) => {
        const indexAnswer = (
          questionType === "mixnet_question" ? key - 1 : key
        )
        return (
          <ShowAnswer
            questionType={questionType}
            indexAnswer={indexAnswer}
            numOptions={closedOptions.length}
            index={index}
            answer={closedOptions[indexAnswer]}
          />
        );
      })}
    </p>
  )
}


function TextSelected({ answers, index, question }) {
  const includeBlankNull = question.include_blank_null === "True";

  if (answers[index] === []) {
    return <p>[ ] Ninguna opción seleccionada</p>;
  } else if (
    answers[index].every((element) => {
      return element === question.closed_options.length;
    }) &&
    includeBlankNull &&
    question.q_type === "mixnet_question"
  ) {
    return <p>Respuesta en blanco</p>;
  } else if (
    answers[index].every((element) => {
      return element === question.closed_options.length + 1;
    }) &&
    includeBlankNull &&
    question.q_type === "mixnet_question"
  ) {
    return <p>Respuesta nula</p>;
  } else {
    return (
      <ShowAnswersList
        currentAns={answers[index]}
        questionType={question.q_type}
        closedOptions={question.closed_options}
      />
    );
  }
}

export default TextSelected;
