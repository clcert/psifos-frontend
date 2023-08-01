import { useEffect } from "react";
import { useState } from "react";

function NumberOfAnswersSetup(props) {
  /** @state {string} question description */
  const [description, setDescription] = useState("");
  const [checkDescription, setCheckDescription] = useState(true);
  const [textDescription, setTextDescription] = useState("");

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

    setCheckDescription(true);
    if (description.length > 100) {
      setTextDescription("La descripción debe tener menos de 100 caracteres");
      setCheckDescription(false);
      final_state = false;
    }

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
      <div className="field">
        <label className="label">Descripción</label>
        <div className="control">
          <textarea
            disabled={props.disabledEdit}
            value={description}
            className={
              "textarea is-small " + (checkDescription ? "" : "is-danger")
            }
            placeholder="Descripción pregunta"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></textarea>
        </div>
        {!checkDescription && (
          <p className="help is-danger">{textDescription}</p>
        )}
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Cantidad mínima de respuestas</label>
            <div className="control">
              <input
                disabled={props.disabledEdit || props.disabledMinAns}
                value={minAnswers}
                className={"input " + (checkMinAnswers ? "" : "is-danger")}
                type="number"
                placeholder="Mínimo"
                onChange={(e) => {
                  const enteredValue = parseInt(e.target.value);
                  if (isNaN(enteredValue) || enteredValue >= 0) {
                    setMinAnswers(enteredValue);
                  }
                }}
              />
            </div>
            {!checkMinAnswers && (
              <p className="help is-danger">{textMinAnswers}</p>
            )}
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Cantidad máxima de respuestas</label>
            <div className="control">
              <input
                id={`question-${props.questionId}-max-answers`}
                disabled={props.disabledEdit}
                value={maxAnswers}
                className={"input " + (checkMaxAnswers ? "" : "is-danger")}
                type="number"
                placeholder="Máximo"
                onChange={(e) => {
                  const enteredValue = parseInt(e.target.value);
                  if (isNaN(enteredValue) || enteredValue >= 0) {
                    setMaxAnswers(parseInt(enteredValue));
                  }
                }}
              />
            </div>
          </div>
          {!checkMaxAnswers && (
            <p className="help is-danger">{textMaxAnswers}</p>
          )}
        </div>
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
