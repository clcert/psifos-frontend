import { useEffect } from "react";
import { useState } from "react";

function OptionQuestions(props) {
  /** @state {string} question description */
  const [description, setDescription] = useState("");

  /** @state {int} min answers for question */
  const [minAnswers, setMinAnswers] = useState("");

  /** @state {int} max answers for questions */
  const [maxAnswers, setMaxAnswers] = useState("");

  /** @state {string} total open options for open election */
  const [totalOpenOptions, setTotalOpenOptions] = useState("");

  /** @state {string} max size text open question */
  const [openOptionsSize, setOpenOptionsSize] = useState("");

  useEffect(() => {
    setDescription(props.question.q_description);
    setMinAnswers(props.question.min_answers);
    setMaxAnswers(props.question.max_answers);
    setTotalOpenOptions(props.question.total_open_options);
    setOpenOptionsSize(props.question.open_option_max_size);
  }, [props.questions]);

  function changeOptions() {
    /**
     * change options for question
     *
     */
    props.changeOptions(
      description,
      totalOpenOptions,
      openOptionsSize,
      minAnswers,
      maxAnswers
    );
  }

  return (
    <div>
      <div className="field">
        <label className="label">Descripción</label>
        <div className="control">
          <textarea
            value={description}
            className="textarea is-small"
            placeholder="Descripción pregunta"
            onChange={(e) => {
              setDescription(e.target.value);
              changeOptions();
            }}
          ></textarea>
        </div>
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Cantidad minima respuestas</label>
            <div className="control">
              <input
                value={minAnswers}
                className="input"
                type="number"
                placeholder="Minimo"
                onChange={(e) => {
                  setMinAnswers(parseInt(e.target.value));
                  changeOptions();
                }}
              />
            </div>
          </div>
        </div>
        <div className="column">
          <div className="field">
            <label className="label">Cantidad maximas respuestas</label>
            <div className="control">
              <input
                value={maxAnswers}
                className="input"
                type="number"
                placeholder="Maximo"
                onChange={(e) => {
                  setMaxAnswers(parseInt(e.target.value));
                  changeOptions();
                }}
              />
            </div>
          </div>
        </div>
      </div>
      {props.q_type === "open_question" && (
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Cantidad respuestas abiertas</label>
              <div className="control">
                <input
                  value={totalOpenOptions}
                  className="input"
                  type="number"
                  placeholder="Cantidad respuestas abiertas"
                  onChange={(e) => {
                    setTotalOpenOptions(parseInt(e.target.value));
                    changeOptions();
                  }}
                />
              </div>
            </div>
          </div>
          <div className="column">
            <div className="field">
              <label className="label">Tamaño maximo respuesta abierta</label>
              <div className="control">
                <input
                  value={openOptionsSize}
                  className="input"
                  type="number"
                  placeholder="Tamaño maximo respuesta abierta"
                  onChange={(e) => {
                    setOpenOptionsSize(parseInt(e.target.value));
                    changeOptions();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OptionQuestions;
