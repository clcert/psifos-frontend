import { useCallback, useEffect, useState } from "react";
import CotedInput from "./CotedInput";

export function DescriptionInput({
  disabledEdit,
  description,
  handleChange,
  checkOptions,
}) {
  const [warningText, setWarningText] = useState(false);

  useEffect(() => {
    if (description?.length > 300) {
      setWarningText("La descripción debe tener menos de 300 caracteres");
    } else {
      setWarningText(false);
    }
  }, [description]);

  useEffect(() => {
    checkOptions(!Boolean(warningText));
  }, [checkOptions, warningText]);

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
      {warningText && <p className="help is-danger">{warningText}</p>}
    </div>
  );
}

function MinOfAnsInput(props) {
  return (
    <CotedInput
      label="Cantidad mínima de opciones"
      inputId={`question-${props.questionId}-min-answers`}
      placeholder="Mínimo"
      minCoteWarningMessage="Debe introducir un número mayor que 0"
      maxCoteWarningMessage="Debe introducir un número menor a la cantidad de opciones"
      {...props}
    />
  );
}

function MaxOfAnsInput(props) {
  return (
    <CotedInput
      label="Cantidad máxima de opciones"
      inputId={`question-${props.questionId}-max-answers`}
      placeholder="Máximo"
      minCoteWarningMessage="Debe introducir un número mayor que 0 y menor que el mínimo"
      maxCoteWarningMessage="Debe introducir un número menor o igual a la cantidad de opciones"
      {...props}
    />
  );
}

export function NumberOfAnswersSetup({
  minAnswers,
  handleMinAns,
  maxAnswers,
  handleMaxAns,
  disabledEdit,
  disabledMinAns,
  questionId,
  numOfOptions,
  checkOptions,
}) {
  const [minOfAnsChecked, setMinOfAnsChecked] = useState(true);
  const [maxOfAnsChecked, setMaxOfAnsChecked] = useState(true);

  const setupMinOfAns = useCallback(() => {
    disabledMinAns && handleMinAns(1);
  }, [disabledMinAns]);

  useEffect(() => {
    setupMinOfAns();
  }, [setupMinOfAns]);

  useEffect(() => {
    checkOptions(minOfAnsChecked && maxOfAnsChecked);
  }, [minOfAnsChecked, maxOfAnsChecked, checkOptions]);

  return (
    <div className="columns">
      <MinOfAnsInput
        isDisabled={disabledEdit || disabledMinAns}
        value={minAnswers}
        questionId={questionId}
        handleInput={(e) => {
          const enteredValue = parseInt(e.target.value);
          if (isNaN(enteredValue) || enteredValue >= 0) {
            handleMinAns(enteredValue);
          }
        }}
        checkOptions={setMinOfAnsChecked}
        minCoteCondition={String(minAnswers) === "NaN" || minAnswers === 0}
        maxCoteCondition={parseInt(minAnswers) > numOfOptions}
        numberOfAns={numOfOptions}
      />
      <MaxOfAnsInput
        isDisabled={disabledEdit}
        value={maxAnswers}
        questionId={questionId}
        handleInput={(e) => {
          const enteredValue = parseInt(e.target.value);
          if (isNaN(enteredValue) || enteredValue >= 0) {
            handleMaxAns(enteredValue);
          }
        }}
        checkOptions={setMaxOfAnsChecked}
        minCoteCondition={
          String(maxAnswers) === "NaN" ||
          maxAnswers === 0 ||
          maxAnswers < minAnswers ||
          numOfOptions < 0
        }
        maxCoteCondition={parseInt(maxAnswers) > numOfOptions}
        numberOfAns={numOfOptions}
      />
    </div>
  );
}

export default NumberOfAnswersSetup;
