import React from "react";
import { 
  isMixNetQuestion, isSTVQuestion,
} from "../../../../utils";

function ShowAnswer({ questionType, indexAnswer, numOptions, index, answer }) {
  return (
    Boolean(answer) && (
      !isMixNetQuestion(questionType)
      || indexAnswer < numOptions - 2
    ) && (
      <React.Fragment key={index}>
        <span key={index}>
          {(
            isSTVQuestion(questionType)
            ? `[${index+1}.] `
            : "[ ✓ ] "
          ) + (
            isMixNetQuestion(questionType) && answer.split(",").length > 1
            ? answer.split(",")[0]
            : answer
          )}
        </span>
        <br />
      </React.Fragment>
    )
  );
}

function ShowAnswersList({ currentAns, questionType, closedOptions }) {
  return (
    <p className="mb-0">
      {currentAns.map((key, index) => {
        const indexAnswer = (
          isMixNetQuestion(questionType) ? key - 1 : key
        )
        return (
          <ShowAnswer
            key={index}
            questionType={questionType}
            indexAnswer={indexAnswer}
            numOptions={closedOptions.length}
            index={index}
            answer={closedOptions[indexAnswer]}
          />
        );
      })}
    </p>
  );
}

function TextSelected({ answers, index, question }) {
  const includeBlankNull = question.include_blank_null === "True";

  if (answers[index].length === 0) {
    return <p>[ ] Ninguna opción seleccionada</p>;
  } else if (
    answers[index].every((element) => {
      return element === question.closed_options.length;
    }) &&
    includeBlankNull &&
    isMixNetQuestion(question.q_type)
  ) {
    return <p>Respuesta en blanco</p>;
  } else if (
    answers[index].every((element) => {
      return element === question.closed_options.length + 1;
    }) &&
    includeBlankNull &&
    isMixNetQuestion(question.q_type)
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
