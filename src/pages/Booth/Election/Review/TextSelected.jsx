import React from "react";

function TextSelected(props) {
  if (props.answers[props.index] === []) {
    return <p>[ ] Ninguna opción seleccionada</p>;
  } else if (
    props.answers[props.index].every((element) => {
      return element === props.question.closed_options.length;
    }) &&
    props.question.include_blank_null &&
    props.question.q_type === "mixnet_question"
  ) {
    return <p>Respuesta en blanco</p>;
  } else if (
    props.answers[props.index].every((element) => {
      return element === props.question.closed_options.length + 1;
    }) &&
    props.question.include_blank_null &&
    props.question.q_type === "mixnet_question"
  ) {
    return <p>Respuesta nula</p>;
  } else {
    return (
      <p className="mb-0">
        {props.answers[props.index].map((key, index) => {
          const indexAnswer =
            props.question.q_type === "mixnet_question" ? key - 1 : key;
          const answer = props.question.closed_options[indexAnswer];
          return (
            (!(props.question.q_type === "mixnet_question") ||
              indexAnswer < props.question.closed_options.length - 2) && (
              <React.Fragment key={index}>
                <span key={index}>
                  {"[ ✓ ] " +
                    (props.question.q_type === "mixnet_question"
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
