import { useState } from "react";
import { Button } from "react-bulma-components";
import InputQuestion from "./InputQuestion";

function QuestionsForms(props) {
  const [answers, setAnswers] = useState([]);
  const [numberQuestion, setNumberQuestion] = useState(1);
  const [typeQuestion, setTypeQuestion] = useState("unic");

  function addAnswer() {
    let answersAux = answers.concat({
      key: numberQuestion,
      value: "",
      correct: false,
      delete: false,
    });

    setAnswers(answersAux);
    setNumberQuestion(numberQuestion + 1);
  }

  function handleRemoveItem(e) {
    const name = e;
    let newAns = [];
    for (let i = 0; i < answers.length; i++) {
      if (answers[i].key !== name) {
        newAns.push(answers[i]);
      }
    }
    setAnswers(newAns);
  }

  function changeQuestion(e) {
    setTypeQuestion(e.target.value);
  }

  return (
    <div className="form-question mt-5">
      <div className="is-flex mb-2 ">
        <input
          className="input mr-3 input-create-question"
          type="text"
          placeholder="Pregunta"
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
              delete={() => {
                handleRemoveItem(item.key);
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
