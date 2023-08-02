import { useEffect, useState } from "react";
import AnswersSetup from "./AnswersQuestions";
import NumberOfAnswersSetup from "./OptionQuestions";

function DeleteQuestionButton({enable, handleDelete}) {
  return (
    <div className="header-question level">
      <div className="level-left"></div>
      <div className="level-right">
        {enable && (
          <i
            onClick={handleDelete}
            className="close-question fa-solid fa-trash"
          ></i>
        )}
      </div>
    </div>
  )
}

function Title({title}) {
  return (
    <div className="create-title mb-1">{title}</div>
  )
}

function QuestionStatementInput({
  questionId, disabledEdit, statement, handleChange,
}) {
  return (
    <div className="is-flex mb-2 ">
      <input
        id={`name-${questionId}`}
        className={"input " + (statement ? "" : "is-danger")}
        disabled={disabledEdit}
        type="text"
        placeholder="Pregunta"
        value={statement}
        onChange={handleChange}
      />
    </div>
  )
}

function QuestionTypeSelector({
  disabledEdit, handleChange, typeQuestion,
}) {
  return (
    <div className="field">
      <label className="label">Tipo de pregunta</label>
      <div className="control">
        <div className="select">
          <select
            disabled={disabledEdit}
            className="mr-2"
            onChange={handleChange}
            value={typeQuestion}
          >
            {/* <option value="open_question">Pregunta abierta</option> */}
            <option value="closed_question">Pregunta cerrada</option>
            <option value="mixnet_question">Pregunta mixnet</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function IncludeBlankNullCheckbox({
  handleChange, disabledEdit, checkedOption,
}) {
  return (
    <div className="field">
      <div className="control">
        <label className="checkbox">
          <input
            disabled={disabledEdit}
            onChange={handleChange}
            checked={checkedOption}
            type="checkbox"
            className="mr-2"
          />
          Incluir voto nulo y blanco
        </label>
      </div>
      <p className="help">
        Se podrá votar por las opciones nulo y blanco.
      </p>
    </div>
  )
}

function GroupApplicationsCheckbox({
  disabledEdit, handleChange, checkedOption,
}) {
  return (
    <div className="field">
      <div className="control">
        <label className="checkbox">
          <input
            disabled={disabledEdit}
            onChange={handleChange}
            checked={checkedOption}
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
  )
}

function QuestionsForms(props) {
  const [answersWithKey, setAnswersWithKey] = useState([]);

  /** @state {int} actual question */
  const [numberQuestion, setNumberQuestion] = useState(1);

  /** @state {string} question type */
  const [typeQuestion, setTypeQuestion] = useState("unic");

  /** @state {boolean} the question includes white & null options */
  const [includedWhiteNull, setIncludeWhiteNull] = useState(
    props.question.include_blank_null
  );

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
      if (answersWithKey[i].key < key) {
        newAns.push(answersWithKey[i]);
      }
      else if (answersWithKey[i].key > key) {
        newAns.push({
          key: answersWithKey[i].key-1,
          value: answersWithKey[i].value,
        });
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
    let ansList = [...answersWithKey];
    for (let i = 0; i < ansList.length; i++) {
      if (ansList[i].key === key) {
        ansList[i].value = newValue;
      }
    }

    let auxQuestion = props.question;
    auxQuestion.closed_options = answersWithoutKey(ansList);
    props.updateQuestions(props.questionId, auxQuestion);
  }

  return (
    <div className="form-question mt-5">
      <DeleteQuestionButton
        enable={!props.disabledEdit}
        handleDelete={props.remove}
      />
      <Title
        title="Pregunta"
      />

      <QuestionStatementInput
        questionId={props.questionId}
        disabledEdit={props.disabledEdit}
        statement={props.question.q_text}
        handleChange={(e) => {
          let auxQuestion = props.question;
          auxQuestion.q_text = e.target.value;
          props.updateQuestions(props.questionId, auxQuestion);
        }}
      />

      {!props.question.q_text && (
        <p className="help is-danger">
          El encabezado de la pregunta no puede ser vacío
        </p>
      )}

      <div className="columns">
        <div className="column">
          <QuestionTypeSelector
            disabledEdit={props.disabledEdit}
            handleChange={changeQuestion}
            typeQuestion={typeQuestion}
          />

          <IncludeBlankNullCheckbox
            handleChange={(e) => {
              let auxQuestion = props.question;
              auxQuestion.include_blank_null = e.target.checked;
              props.updateQuestions(props.questionId, auxQuestion);
              setIncludeWhiteNull(!includedWhiteNull);
            }}
            disabledEdit={props.disabledEdit}
            checkedOption={props.question.include_blank_null}
          />

          {props.question.q_type === "mixnet_question" && (
            <GroupApplicationsCheckbox
              disabledEdit={props.disabledEdit}
              handleChange={(e) => {
                let auxQuestion = props.question;
                auxQuestion.group_votes = e.target.checked;
                props.updateQuestions(props.questionId, auxQuestion);
              }}
              checkedOption={props.question.group_votes}
            />
          )}
        </div>
      </div>

      <NumberOfAnswersSetup
        question={props.question}
        questionId={props.questionId}
        disabledEdit={props.disabledEdit}
        checkOptions={props.checkOptions}
        updateQuestions={props.updateQuestions}
        disabledMinAns={includedWhiteNull}
      />

      <AnswersSetup
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
  );
}
export default QuestionsForms;
