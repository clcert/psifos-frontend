import { useEffect, useState } from "react";
import { Button } from "react-bulma-components";
import InputQuestion from "./InputQuestion";
import OptionQuestions from "./OptionQuestions";

function QuestionsForms(props) {
  /** @state {array} answers for actual questions */
  const [answers, setAnswers] = useState([]);

  /** @state {int} actual question */
  const [numberQuestion, setNumberQuestion] = useState(1);

  /** @state {string} question type */
  const [typeQuestion, setTypeQuestion] = useState("unic");

  /** @state {string} question text */
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (props.question !== undefined) {
      setQuestion(props.question.q_text);
      let answersAux = [];
      for (let i = 0; i < props.question.closed_options.length; i++) {
        answersAux.push({
          key: i,
          value: props.question.closed_options[i],
        });
      }
      setNumberQuestion(props.question.closed_options.length);
      setTypeQuestion(props.question.q_type);
      setAnswers(answersAux);
    }
  }, [props.question]);

  function addAnswer() {
    /**
     * add new answers to array allowing rendering
     **/
    let answersAux = answers.concat({
      key: numberQuestion,
      value: "",
    });

    setAnswers(answersAux);
    setNumberQuestion(numberQuestion + 1);
  }

  function handleRemoveItem(key) {
    /**
     * remove item from array
     * @param {number} key
     */

    let newAns = [];
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].key !== key) {
        newAns.push(answers[i]);
      }
    }
    setAnswers(newAns);
    props.changeQuestion(question, newAns);
  }

  function changeQuestion(e) {
    /**
     * change question type
     * @param {event} e
     */

    setTypeQuestion(e.target.value);
    props.editType(e.target.value);
  }

  function editAnswer(key, newValue) {
    let auxAns = [...answers];
    for (let i = 0; i < auxAns.length; i++) {
      if (auxAns[i].key === key) {
        auxAns[i].value = newValue;
      }
    }
    setAnswers(auxAns);
    props.changeQuestion(question, auxAns);
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
          className="input"
          disabled={props.disabledEdit}
          type="text"
          placeholder="Pregunta"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            props.changeQuestion(question, answers);
          }}
        />
      </div>
      <div className="columns">
        <div className="column">
          <div className="field">
            <label className="label">Tipo de pregunta</label>
            <div className="control">
              <select
                disabled={props.disabledEdit}
                className="mr-2"
                onChange={changeQuestion}
                value={typeQuestion}
              >
                {/* <option value="open_question">Pregunta abierta</option> */}
                <option value="closed_question">Pregunta cerrada</option>
              </select>
            </div>
          </div>
        </div>
        {/* <div className="column">
          <div className="field">
            <label className="label">Cantidad maximas respuestas</label>
            <div className="control">
              <select
                disabled={props.disabledEdit}
                className="mr-2"
                onChange={changeQuestion}
                value={typeQuestion}
              >
                <option value="closed_question">Pregunta cerrada</option>
                <option value="open_question">Pregunta abierta</option>
              </select>
            </div>
          </div>
        </div> */}
      </div>
      <OptionQuestions
        disabledEdit={props.disabledEdit}
        q_type={typeQuestion}
        changeOptions={props.changeOptions}
        question={props.question}
        checkOptions={props.checkOptions}
        answers={answers}
      />

      <div className="create-title ml-2 mb-1">Respuestas</div>
      <div id="create-questions">
        {answers.map((item, index) => {
          return (
            <InputQuestion
              disabledEdit={props.disabledEdit}
              key={item.key}
              value={item.value}
              numberQuestion={item.key}
              delete={() => {
                handleRemoveItem(item.key);
              }}
              onChange={(key, value) => {
                editAnswer(key, value);
              }}
            ></InputQuestion>
          );
        })}
      </div>
      {!props.disabledEdit && (
        <div className="is-flex level">
          <div className="is-flex leve-left">
            <Button
              className="button-create-question"
              onClick={() => {
                addAnswer();
              }}
            >
              Añadir opción
            </Button>
          </div>
          <div className="level-right">
            <Button className="button-create-question">Duplicar</Button>
          </div>
        </div>
      )}
    </div>
  );
}
export default QuestionsForms;
