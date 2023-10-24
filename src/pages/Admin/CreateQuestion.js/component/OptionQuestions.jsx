import { useEffect, useState } from "react";

export function DescriptionInput({
  disabledEdit, description, handleChange, checkOptions,
}) {
  const [warningText, setWarningText] = useState(false);

  useEffect(() => {
    if (description?.length > 100) {
      setWarningText(
        "La descripción debe tener menos de 100 caracteres"
      );
      checkOptions(false);
    }
    else {
      setWarningText(false);
    }
  }, [description]);

  return (
    <div className="field">
      <label className="label">Descripción</label>
      <div className="control">
        <textarea
          disabled={disabledEdit}
          value={description}
          className={`textarea is-small ${warningText && "is-danger"}`}
          placeholder="Descripción pregunta"
          onChange={(e) => handleChange(e.target.value)}
        />
      </div>
      {warningText && (
        <p className="help is-danger">{warningText}</p>
      )}
    </div>
  )
}

function NumberOfAnsInput({
  label, isDisabled, value, inputId,
  placeholder, handleInput, checkOptions, numberOfAns,
  minCoteCondition, minCoteWarningMessage,
  maxCoteCondition, maxCoteWarningMessage,
}) {
  const [warningText, setWarningText] = useState(false);

  useEffect(() => {
    let wt = false
    if (!isDisabled){
      if (minCoteCondition) {
        wt = minCoteWarningMessage;
        checkOptions(false);
      }
      else if (maxCoteCondition){
        wt = maxCoteWarningMessage;
        checkOptions(false);
      }
    }
    setWarningText(wt);
  }, [value, isDisabled, numberOfAns]);

  return (
    <div className="column" style={{paddingLeft: "0px"}}>
      <div className="field">
        <label className="label">{label}</label>
        <div className="control">
          <input
            id={inputId}
            disabled={isDisabled}
            value={value}
            className={`input ${warningText && "is-danger"}`}
            type="number"
            placeholder={placeholder}
            onChange={handleInput}
          />
        </div>
        {warningText && (
          <p className="help is-danger">{warningText}</p>
        )}
      </div>
    </div>
  )
}

function MinOfAnsInput(props) {
  return (
    <NumberOfAnsInput
      label="Cantidad mínima de respuestas"
      inputId={`question-${props.questionId}-min-answers`}
      placeholder="Mínimo"
      minCoteWarningMessage="Debe introducir un número mayor que 0"
      maxCoteWarningMessage="Debe introducir un número menor a la cantidad de respuestas"
      {...props}
    />
  )
}

function MaxOfAnsInput(props) {
  return (
    <NumberOfAnsInput
      label="Cantidad máxima de respuestas"
      inputId={`question-${props.questionId}-max-answers`}
      placeholder="Máximo"
      minCoteWarningMessage="Debe introducir un número mayor que 0 y menor que el mínimo"
      maxCoteWarningMessage="Debe introducir un número menor o igual a la cantidad de respuestas"
      {...props}
    />
  )
}

export function NumberOfAnswersSetup({
  disabledEdit, disabledMinAns,
  questionId, numOfOptions, checkOptions,
}) {
  /** @state {int} min answers for question */
  const [minAnswers, setMinAnswers] = useState("");

  /** @state {int} max answers for questions */
  const [maxAnswers, setMaxAnswers] = useState("");

  useEffect(() => {
    disabledMinAns && setMinAnswers(1)
  }, [disabledMinAns]);

  return (
    <div className="columns">
      <MinOfAnsInput
        isDisabled={disabledEdit || disabledMinAns}
        value={minAnswers}
        questionId={questionId}
        handleInput={(e) => {
          const enteredValue = parseInt(e.target.value);
          if (isNaN(enteredValue) || enteredValue >= 0) {
            setMinAnswers(enteredValue);
          }
        }}
        checkOptions={checkOptions}
        minCoteCondition={String(minAnswers) === "NaN" || minAnswers === 0}
        maxCoteCondition={minAnswers > numOfOptions}
        numberOfAns={numOfOptions}
      />
      <MaxOfAnsInput
        isDisabled={disabledEdit}
        value={maxAnswers}
        questionId={questionId}
        handleInput={(e) => {
          const enteredValue = parseInt(e.target.value);
          if (isNaN(enteredValue) || enteredValue >= 0) {
            setMaxAnswers(enteredValue);
          }
        }}
        checkOptions={checkOptions}
        minCoteCondition={
          String(maxAnswers) === "NaN" || maxAnswers === 0 || maxAnswers < minAnswers
        }
        maxCoteCondition={maxAnswers > numOfOptions}
        numberOfAns={numOfOptions}
      />
    </div>
  )
}

export default NumberOfAnswersSetup;
