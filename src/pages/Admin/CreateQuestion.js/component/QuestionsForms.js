import { useEffect, useState } from "react";
import { Button } from "react-bulma-components";
import InputQuestion from "./InputQuestion";

function QuestionsForms(props) {
  const [answers, setAnswers] = useState([]);
  const [numberQuestion, setNumberQuestion] = useState(1);
  const [typeQuestion, setTypeQuestion] = useState("unic");
  const [question, setQuestion] = useState("");

  useEffect(() => {
    if (props.question !== undefined) {
      setQuestion(props.question.question);
      setAnswers(props.question.answers);
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
  }

  function changeQuestion(e) {
    /**
     * change question type
     * @param {event} e
     */
    setTypeQuestion(e.target.value);
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
          <i
            onClick={props.remove}
            className="close-question fa-solid fa-trash"
          ></i>
        </div>
      </div>
      <div className="is-flex mb-2 ">
        <input
          className="input mr-3 input-create-question"
          type="text"
          placeholder="Pregunta"
          value={question}
          onChange={(e) => {
            setQuestion(e.target.value);
            props.changeQuestion(question, answers);
          }}
        />
        <select className="mr-2" onChange={changeQuestion} value={typeQuestion}>
          <option value="unic">Unica Opción</option>
          <option value="multi">Opciones Multiples</option>
          <option value="pharaf">Parrafo</option>
        </select>
        {typeQuestion === "multi" ? (
          <>
            {" "}
            <input className="input-number-question mr-2" type="number" />
            <input className="input-number-question" type="number" />
          </>
        ) : null}
      </div>
      <div id="create-questions">
        {answers.map((item, index) => {
          return (
            <InputQuestion
              key={item.key}
              numberQuestion={item.key}
              value={item.value}
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
    </div>
  );
}
export default QuestionsForms;
