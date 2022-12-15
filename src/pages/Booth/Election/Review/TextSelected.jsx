import React from "react";

function TextSelected(props) {
  if (props.answers[props.index] === []) {
    return <p>[ ] Ninguna opción seleccionada</p>;
  } else if (
    props.answers[props.index].every((element) => {
      return element === 1;
    }) &&
    props.blankNullVote
  ) {
    return <p>Respuesta en blanco</p>;
  } else if (
    props.answers[props.index].every((element) => {
      return element === 2;
    }) &&
    props.blankNullVote
  ) {
    return <p>Respuesta nula</p>;
  } else {
    return (
      <p>
        {props.answers[props.index].map((key, index) => {
          const indexAnswer = props.blankNullVote ? key - 3 : key;
          return (
            (!props.blankNullVote || indexAnswer >= 0) && (
              <React.Fragment key={index}>
                <span key={index}>
                  {"[ ✓ ] " + props.value.closed_options[indexAnswer] + " "}
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
