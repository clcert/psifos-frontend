import { useEffect, useState } from "react";
import AnswersQuestions from "./AnswersQuestions";
import OptionQuestions from "./OptionQuestions";

function QuestionsForms(props) {
  const [answersWithKey, setAnswersWithKey] = useState([]);

  /** @state {int} actual question */
  const [numberQuestion, setNumberQuestion] = useState(1);

  /** @state {string} question type */
  const [typeQuestion, setTypeQuestion] = useState("unic");

  useEffect(() => {
    if (props.question !== undefined) {
      let answersAux = [];
      for (let i = 0; i < props.question.closed_options.length; i++) {
        answersAux.push({
          key: i,
          value: props.question.closed_options[i],
        });
      }
      setAnswersWithKey(answersAux);
      setNumberQuestion(props.question.closed_options.length);
      setTypeQuestion(props.question.q_type);
    }
  }, []);

  function answersWithoutKey(arrayWithKeys) {
    let auxAnswers = [];
    for (let i = 0; i < arrayWithKeys.length; i++) {
      auxAnswers[i] = arrayWithKeys[i].value;
    }
    return auxAnswers;
  }

  function addAnswer() {
    /**
     * add new answers to array allowing rendering
     **/
    let newAns = answersWithKey.concat({
      key: numberQuestion,
      value: "",
    });
    let auxQuestion = props.question;
    auxQuestion.closed_options = answersWithoutKey(newAns);
    props.updateQuestions(props.questionId, auxQuestion);

    setAnswersWithKey(newAns);
    setNumberQuestion(numberQuestion + 1);
  }

  function handleRemoveItem(key) {
    /**
     * remove item from array
     * @param {number} key
     */

    let newAns = [];
    for (let i = 0; i < answersWithKey.length; i++) {
      if (answersWithKey[i].key !== key) {
        newAns.push(answersWithKey[i]);
      }
    }
    let auxQuestion = props.question;
    auxQuestion.closed_options = answersWithoutKey(newAns);
    props.updateQuestions(props.questionId, auxQuestion);

    setAnswersWithKey(newAns);
    setNumberQuestion(numberQuestion - 1);
  }

  function changeQuestion(e) {
    /**
     * change question type
     * @param {event} e
     */

    setTypeQuestion(e.target.value);
    let auxQuestion = props.question;
    auxQuestion.q_type = e.target.value;
    auxQuestion.closed_options = [];
    setAnswersWithKey([]);
    props.updateQuestions(props.questionId, auxQuestion);
  }

  function editAnswer(key, newValue) {
    let newAns = [...answersWithKey];
    for (let i = 0; i < newAns.length; i++) {
      if (newAns[i].key === key) {
        newAns[i].value = newValue;
      }
    }

    let auxQuestion = props.question;
    auxQuestion.closed_options = answersWithoutKey(newAns);
    props.updateQuestions(props.questionId, auxQuestion);
  }

  return (
    <div className="form-question mt-5">
      <div className="header-question level">
        <div className="level-left"></div>
        <div className="level-right">
          {!props.disabledEdit && (
            <i
              onClick={props.remove}
              className="close-question fa-solid fa-trash"
            ></i>
          )}
        </div>
      </div>

      <div className="create-title mb-1">Pregunta</div>
      <div className="is-flex mb-2 ">
        <input
          id={`name-${props.questionId}`}
          className="input"
          disabled={props.disabledEdit}
          type="text"
          placeholder="Pregunta"
          value={props.question.q_text}
          onChange={(e) => {
            let auxQuestion = props.question;
            auxQuestion.q_text = e.target.value;
            props.updateQuestions(props.questionId, auxQuestion);
          }}
        />
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Tipo de pregunta</label>
            <div className="control">
              <div className="select">
                <select
                  disabled={props.disabledEdit}
                  className="mr-2"
                  onChange={changeQuestion}
                  value={typeQuestion}
                >
                  {/* <option value="open_question">Pregunta abierta</option> */}
                  <option value="closed_question">Pregunta cerrada</option>
                  <option value="mixnet_question">Pregunta mixnet</option>
                </select>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  disabled={props.disabledEdit}
                  onChange={(e) => {
                    let auxQuestion = props.question;
                    auxQuestion.include_blank_null = e.target.checked;
                    props.updateQuestions(props.questionId, auxQuestion);
                  }}
                  checked={props.question.include_blank_null}
                  type="checkbox"
                  className="mr-2"
                />
                Incluir voto nulo o blanco
              </label>
            </div>
            <p className="help">
              Se incluira la opción para votar nulo o blanco.
            </p>
          </div>
          {props.question.q_type === "mixnet_question" && (
            <div className="field">
              <div className="control">
                <label className="checkbox">
                  <input
                    disabled={props.disabledEdit}
                    onChange={(e) => {
                      let auxQuestion = props.question;
                      auxQuestion.group_votes = e.target.checked;
                      props.updateQuestions(props.questionId, auxQuestion);
                    }}
                    checked={props.question.group_votes}
                    type="checkbox"
                    className="mr-2"
                  />
                  Agrupar candidaturas
                </label>
              </div>
              <p className="help">
                Se agruparan los distintos votos por grupo.
              </p>
            </div>
          )}
        </div>
      </div>
      <OptionQuestions
        question={props.question}
        questionId={props.questionId}
        disabledEdit={props.disabledEdit}
        checkOptions={props.checkOptions}
        updateQuestions={props.updateQuestions}
      />

      <div>
        <AnswersQuestions
          question={props.question}
          editAnswer={editAnswer}
          addAnswer={addAnswer}
          updateQuestions={props.updateQuestions}
          questionId={props.questionId}
          answersWithKey={answersWithKey}
          handleRemoveItem={handleRemoveItem}
          disabledEdit={props.disabledEdit}
        />
      </div>
    </div>
  );
}
export default QuestionsForms;
