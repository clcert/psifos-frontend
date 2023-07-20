import React from "react";

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
      <p className="mb-0">
        {answers[index].map((key, index) => {
          const indexAnswer =
            question.q_type === "mixnet_question" ? key - 1 : key;
          const answer = question.closed_options[indexAnswer];
          return (
            (!(question.q_type === "mixnet_question") ||
              indexAnswer < question.closed_options.length - 2) && (
              <React.Fragment key={index}>
                <span key={index}>
                  {"[ ✓ ] " +
                    (question.q_type === "mixnet_question"
                      ? answer.split(",").length > 1
                        ? answer.split(",")[0] + " - " + answer.split(",")[1]
                        : answer
                      : answer)}
                </span>
                <br />
              </React.Fragment>
            )
          );
        })}
      </p>
    );
  }
}

export default TextSelected;
