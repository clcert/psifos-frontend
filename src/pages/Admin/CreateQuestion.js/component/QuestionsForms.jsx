import { useEffect, useState } from "react";
import { applyAccent } from "../../utils";
import { DescriptionInput } from "./OptionQuestions";
import AnswersSetup from "./AnswersQuestions";
import NumberOfAnswersSetup from "./OptionQuestions";
import DeleteQuestionButton from "./DeleteQuestionButton";
import QuestionStatementInput from "./QuestionStatementInput";
import QuestionTypeSelector from "./QuestionTypeSelector";
import IncludeBlankNullCheckbox from "./IncludeBlankNullCheckbox";
import GroupApplicationsCheckbox from "./GroupApplicationsCheckbox";

function Title({title}) {
  return (
    <div className="create-title mb-1">{title}</div>
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

  const [descriptionChecked, setDescriptionChecked] = useState(true);
  const [numberOfAnsChecked, setNumberOfAnsChecked] = useState(true);

  const numOfClosedOptions = props.question.closed_options.length;

  useEffect(() => {
    if (props.question !== undefined) {
      let answersAux = [];
      for (let i = 0; i < numOfClosedOptions; i++) {
        answersAux.push({
          key: i,
          value: props.question.closed_options[i],
        });
      }
      setAnswersWithKey(answersAux);
      setNumberQuestion(numOfClosedOptions);
      setTypeQuestion(props.question.q_type);
    }
  }, []);

  useEffect(() => {
    props.checkOptions(descriptionChecked && numberOfAnsChecked)
  }, [descriptionChecked, numberOfAnsChecked])

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
        ansList[i].value = applyAccent(newValue);
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
        statement={props.question.q_text}
        handleChange={(e) => {
          let auxQuestion = props.question;
          auxQuestion.q_text = e.target.value;
          props.updateQuestions(props.questionId, auxQuestion);
        }}
        {...props}
      />

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

      <GroupApplicationsCheckbox
        questionType={props.question.q_type}
        disabledEdit={props.disabledEdit}
        handleChange={(e) => {
          let auxQuestion = props.question;
          auxQuestion.group_votes = e.target.checked;
          props.updateQuestions(props.questionId, auxQuestion);
        }}
        checkedOption={props.question.group_votes}
      />

      <DescriptionInput
        description={props.question.q_description}
        handleChange={(newDesc) => {
          let auxQuestion = props.question;
          auxQuestion.q_description = newDesc;
          props.updateQuestions(props.questionId, auxQuestion);
        }}
        checkOptions={setDescriptionChecked}
        {...props}
      />

      <NumberOfAnswersSetup
        disabledMinAns={includedWhiteNull}
        numOfOptions={numOfClosedOptions}
        minAnswers={props.question.min_answers}
        handleMinAns={(e) => {
          let auxQuestion = props.question;
          auxQuestion.min_answers = e;
          props.updateQuestions(props.questionId, auxQuestion);
        }}
        maxAnswers={props.question.max_answers}
        handleMaxAns={(e) => {
          let auxQuestion = props.question;
          auxQuestion.max_answers = e;
          props.updateQuestions(props.questionId, auxQuestion);
        }}
        checkOptions={setNumberOfAnsChecked}
        {...props}
      />

      <AnswersSetup
        editAnswer={editAnswer}
        addAnswer={addAnswer}
        answersWithKey={answersWithKey}
        handleRemoveItem={handleRemoveItem}
        {...props}
      />
    </div>
  );
}

export default QuestionsForms;
