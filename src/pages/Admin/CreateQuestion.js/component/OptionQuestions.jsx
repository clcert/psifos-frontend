import { useEffect } from "react";
import { useState } from "react";

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

export function NumberOfAnsInput({
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

export function MinOfAnsInput(props) {
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

export function MaxOfAnsInput(props) {
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

function NumberOfAnswersSetup(props) {
  /** @state {string} question description */
  const [description, setDescription] = useState("");

  /** @state {int} min answers for question */
  const [minAnswers, setMinAnswers] = useState("");
  const [checkMinAnswers, setCheckMinAnswers] = useState(true);
  const [textMinAnswers, setTextMinAnswers] = useState("");

  /** @state {int} max answers for questions */
  const [maxAnswers, setMaxAnswers] = useState("");
  const [checkMaxAnswers, setCheckMaxAnswers] = useState(true);
  const [textMaxAnswers, setTextMaxAnswers] = useState("");

  /** @state {string} total open options for open election */
  const [totalOpenOptions, setTotalOpenOptions] = useState("");
  const [checkTotalOpenOptions, setCheckTotalOpenOptions] = useState(true);
  const [textTotalOpenOptions, setTextTotalOpenOptions] = useState("");

  /** @state {string} max size text open question */
  const [openOptionsSize, setOpenOptionsSize] = useState("");
  const [checkOpenOptionsSize, setCheckOpenOptionsSize] = useState(true);
  const [textOpenOptionsSize, setTextOpenOptionsSize] = useState("");

  useEffect(() => {
    setDescription(props.question.q_description);
    setMinAnswers(props.question.min_answers);
    setMaxAnswers(props.question.max_answers);
    setTotalOpenOptions(props.question.total_open_options);
    setOpenOptionsSize(props.question.open_option_max_size);
  }, []);

  useEffect(() => {
    changeOptions();
  }, [description, openOptionsSize, totalOpenOptions, minAnswers, maxAnswers]);

  function changeOptions() {
    /**
     * change options for question
     *
     */

    let auxQuestion = props.question;
    auxQuestion.q_description = description;
    auxQuestion.open_option_max_size = openOptionsSize;
    auxQuestion.total_open_options = totalOpenOptions;
    auxQuestion.min_answers = minAnswers;
    auxQuestion.max_answers = maxAnswers;
    props.updateQuestions(props.questionId, auxQuestion);
  }

  function checkOptions() {
    /**
     * check options for question
     */
    let final_state = true;

    setCheckMinAnswers(true);
    if (String(minAnswers) === "NaN" || minAnswers === 0) {
      setTextMinAnswers("Debe introducir un número mayor que 0");
      setCheckMinAnswers(false);
      final_state = false;
    }

    if (minAnswers > props.question.closed_options.length) {
      setTextMinAnswers(
        "Debe introducir un número menor a la cantidad de respuestas"
      );
      setCheckMinAnswers(false);
      final_state = false;
    }
    setCheckMaxAnswers(true);
    if (maxAnswers > props.question.closed_options.length) {
      setTextMaxAnswers(
        "Debe introducir un número menor a la cantidad de respuestas"
      );
      setCheckMaxAnswers(false);
      final_state = false;
    }

    if (
      String(maxAnswers) === "NaN" ||
      maxAnswers === 0 ||
      maxAnswers < minAnswers
    ) {
      setTextMaxAnswers(
        "Debe introducir un número mayor que 0 y menor que el mínimo"
      );
      setCheckMaxAnswers(false);
      final_state = false;
    }

    setCheckTotalOpenOptions(true);
    if (String(totalOpenOptions) === "NaN" || totalOpenOptions < 0) {
      setTextTotalOpenOptions("Debe introducir un número mayor que 0");
      setCheckTotalOpenOptions(false);
      final_state = false;
    }

    setCheckOpenOptionsSize(true);
    if (String(openOptionsSize) === "NaN" || openOptionsSize < 0) {
      setTextOpenOptionsSize("Debe introducir un número mayor que 0");
      setCheckOpenOptionsSize(false);
      final_state = false;
    }
    props.checkOptions(final_state);
  }

  useEffect(() => {
    checkOptions();
  }, [
    description,
    minAnswers,
    maxAnswers,
    totalOpenOptions,
    openOptionsSize,
    props.question.closed_options,
  ]);

  useEffect(() => {
    props.disabledMinAns && setMinAnswers(1)
  }, [props.disabledMinAns]);

  return (
    <div>
      <div className="columns">
      <MinOfAnsInput
          isDisabled={props.disabledEdit || props.disabledMinAns}
          value={minAnswers}
          questionId={props.questionId}
          handleInput={(e) => {
            const enteredValue = parseInt(e.target.value);
            if (isNaN(enteredValue) || enteredValue >= 0) {
              setMinAnswers(enteredValue);
            }
          }}
          checkOptions={props.checkOptions}
          minCoteCondition={String(minAnswers) === "NaN" || minAnswers === 0}
          maxCoteCondition={minAnswers > props.question.closed_options.length}
          numberOfAns={props.question.closed_options.length}
        />
        <MaxOfAnsInput
          isDisabled={props.disabledEdit}
          value={maxAnswers}
          questionId={props.questionId}
          handleInput={(e) => {
            const enteredValue = parseInt(e.target.value);
            if (isNaN(enteredValue) || enteredValue >= 0) {
              setMaxAnswers(enteredValue);
            }
          }}
          checkOptions={props.checkOptions}
          minCoteCondition={
            String(maxAnswers) === "NaN" || maxAnswers === 0 || maxAnswers < minAnswers
          }
          maxCoteCondition={maxAnswers > props.question.closed_options.length}
          numberOfAns={props.question.closed_options.length}
        />
      </div>
      {props.q_type === "open_question" && (
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Cantidad respuestas abiertas</label>
              <div className="control">
                <input
                  disabled={props.disabledEdit}
                  value={totalOpenOptions}
                  className={
                    "input " + (checkTotalOpenOptions ? "" : "is-danger")
                  }
                  type="number"
                  placeholder="Cantidad respuestas abiertas"
                  onChange={(e) => {
                    setTotalOpenOptions(parseInt(e.target.value));
                  }}
                />
              </div>
              {!checkTotalOpenOptions && (
                <p className="help is-danger">{textTotalOpenOptions}</p>
              )}
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label">Tamaño máximo respuesta abierta</label>
              <div className="control">
                <input
                  disabled={props.disabledEdit}
                  value={openOptionsSize}
                  className={
                    "input " + (checkOpenOptionsSize ? "" : "is-danger")
                  }
                  type="number"
                  placeholder="Tamaño maximo respuesta abierta"
                  onChange={(e) => {
                    setOpenOptionsSize(parseInt(e.target.value));
                  }}
                />
              </div>
            </div>
            {!checkOpenOptionsSize && (
              <p className="help is-danger">{textOpenOptionsSize}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default NumberOfAnswersSetup;
