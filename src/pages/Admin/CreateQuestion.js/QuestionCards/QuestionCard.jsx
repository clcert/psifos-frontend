import { useCallback, useEffect, useState } from "react";
import { DescriptionInput } from "../component/OptionQuestions";
import AnswersSetup from "./AnswersSetup/AnswersSetup";
import NumberOfAnswersSetup from "../component/OptionQuestions";
import DeleteQuestionButton from "../component/DeleteQuestionButton";
import QuestionStatementInput from "../component/QuestionStatementInput";
import QuestionTypeSelector from "../component/QuestionTypeSelector";
import IncludeBlankNullCheckbox from "../component/IncludeBlankNullCheckbox";
import GroupApplicationsCheckbox from "../component/GroupApplicationsCheckbox";
import NumberOfWinnersInput from "../component/NumberOfWinnersInput";
import ExcludingGroups from "../component/ExcludingGroups";
import { isSTVQuestion } from "../../../../utils";
import { applyAccent } from "../../utils";
import { generateClosedOptions, getListFromObjects } from "../utils";

const editAnswer = (
  key, newValue, answerObjects, question, updateThisQuestion,
)  => {
  const updatedAnswers = answerObjects.map((answer) => 
    answer.key === key ? {
      ...answer, value: applyAccent(newValue)
    } : answer
  );
  const ansList = getListFromObjects(updatedAnswers)
  const updatedQuestion = {
    ...question,
    closed_options: generateClosedOptions(
      question.include_blank_null, ansList
    )
  };
  updateThisQuestion(updatedQuestion);
}

const editAnswerImg = (
  key, newValue, imageObjects, question, updateThisQuestion
) => {
  const updatedImgList = imageObjects.map((img) =>
    img.key === key ? {
      ...img, value: applyAccent(newValue)
    } : img
  );

  const updatedQuestion = {
    ...question,
    options_specifications: getListFromObjects(updatedImgList)
  };

  updateThisQuestion(updatedQuestion);
}

function Title({ title }) {
  return (
    <div className="create-title mb-1">
      {title}
    </div>
  );
}

export default function QuestionCard({
  updateQuestion, question, questionId,
  disabledEdit, remove, checkOptions,
}) {

  const {
    include_blank_null, num_of_winners,
    q_type, q_text, q_description,
    closed_options, options_specifications,
    total_closed_options, total_options,
    excluding_groups, group_votes,
    min_answers, max_answers,
  } = question

  /** Attributes of the question that can be changed */
  const [answerObjects, setAnswerObjects] = useState([]);
  const [imageObjects, setImageObjects] = useState([]);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [questionType, setQuestionType] = useState("CLOSED");
  const [includesInformalAns, setIncludesInformalAns] = useState(include_blank_null);
  const [numberOfWinners, setNumberOfWinners] = useState(true);

  /** Checks if the question characteristics are allowed */
  const [descriptionChecked, setDescriptionChecked] = useState(true);
  const [numberOfAnsChecked, setNumberOfAnsChecked] = useState(true);

  const numOfClosedOptions = total_closed_options;
  const initComponent = useCallback(() => {
    if (question !== undefined) {
      let answersAux = [];
      let imgAux = [];

      for (let i = 0; i < total_options; i++) {
        answersAux.push({
          key: i,
          value: closed_options[i],
        });
        imgAux.push({
          key: i,
          value: options_specifications[i],
        });
      }
      setAnswerObjects(answersAux);
      setImageObjects(imgAux);
      setQuestionNumber(numOfClosedOptions);
      setQuestionType(q_type);
    }
  }, [numOfClosedOptions, question]);

  useEffect(() => {
    initComponent();
  }, [initComponent]);

  useEffect(() => {
    checkOptions(
      descriptionChecked && numberOfAnsChecked && numberOfWinners
    );
  }, [descriptionChecked, numberOfAnsChecked, numberOfWinners]);

  function addAnswer() {
    let newAnsWithKeyList = answerObjects.concat({
      key: questionNumber,
      value: "",
    });
    let newImgWithKeyList = imageObjects.concat({
      key: questionNumber,
      value: "",
    });
    let auxQuestion = question;
    
    const ansList = getListFromObjects(newAnsWithKeyList)
    auxQuestion.closed_options = generateClosedOptions(
      question.include_blank_null,
      ansList
    )
    auxQuestion.total_closed_options = auxQuestion.closed_options.length
    auxQuestion.options_specifications = getListFromObjects(newImgWithKeyList);
    updateQuestion(questionId, auxQuestion);
    setAnswerObjects(newAnsWithKeyList);
    setImageObjects(newImgWithKeyList)
    setQuestionNumber(questionNumber + 1);
  }

  function handleRemoveOption(key) {
    /**
     * remove item from array
     * @param {number} key
     */

    let newAnsWithKeyList = [];
    let newImgWithKeyList = [];
    for (let i = 0; i < answerObjects.length; i++) {
      if (answerObjects[i].key < key) {
        newAnsWithKeyList.push(answerObjects[i]);
        newImgWithKeyList.push(imageObjects[i]);
      } else if (answerObjects[i].key > key) {
        newAnsWithKeyList.push({
          key: answerObjects[i].key - 1,
          value: answerObjects[i].value,
        });
        newImgWithKeyList.push({
          key: imageObjects[i].key - 1,
          value: imageObjects[i].value,
        });
      }
    }
    let auxQuestion = question;
    auxQuestion.closed_options = generateClosedOptions(
      question.include_blank_null,
      getListFromObjects(newAnsWithKeyList)
    );
    auxQuestion.options_specifications = getListFromObjects(newImgWithKeyList);
    updateQuestion(questionId, auxQuestion);
    setAnswerObjects(newAnsWithKeyList);
    setImageObjects(newImgWithKeyList);
    setQuestionNumber(questionNumber - 1);
  }

  function changeQuestionType(e) {
    /**
     * change question type
     * @param {event} e
     */
    setQuestionType(e.target.value);
    let auxQuestion = question;
    auxQuestion.q_type = e.target.value;
    auxQuestion.closed_options = generateClosedOptions(
      question.include_blank_null,
      []
    );
    auxQuestion.total_closed_options = 0
    auxQuestion.options_specifications = [];
    setAnswerObjects([]);
    setImageObjects([]);
    updateQuestion(questionId, auxQuestion);
  }

  return (
    <div className="form-question mt-5">
      <DeleteQuestionButton
        enable={!disabledEdit}
        handleDelete={remove}
      />

      <Title title="Pregunta" />

      <QuestionStatementInput
        questionId={questionId}
        disabledEdit={disabledEdit}
        statement={q_text}
        handleChange={(e) => {
          let auxQuestion = question;
          auxQuestion.q_text = e.target.value;
          updateQuestion(questionId, auxQuestion);
        }}
      />

      <QuestionTypeSelector
        disabledEdit={disabledEdit}
        handleChange={changeQuestionType}
        questionType={questionType}
      />

      <IncludeBlankNullCheckbox
        handleChange={(e) => {
          const includes = e.target.checked
          let auxQuestion = question;
          auxQuestion.include_blank_null = e.target.checked;
          auxQuestion.closed_options = generateClosedOptions(
            includes, getListFromObjects(answerObjects)
          )
          updateQuestion(questionId, auxQuestion);
          setIncludesInformalAns(!includesInformalAns);
        }}
        disabledEdit={disabledEdit}
        checkedOption={include_blank_null}
      />

      <ExcludingGroups
        handleChange={(e) => {
          let auxQuestion = question;
          auxQuestion.excluding_groups = e.target.checked;
          updateQuestion(questionId, auxQuestion);
        }}
        disabledEdit={disabledEdit}
        checkedOption={excluding_groups}
      />

      <GroupApplicationsCheckbox
        questionType={q_type}
        disabledEdit={disabledEdit}
        handleChange={(e) => {
          let auxQuestion = question;
          auxQuestion.group_votes = e.target.checked;
          updateQuestion(questionId, auxQuestion);
        }}
        checkedOption={group_votes}
      />

      <DescriptionInput
        disabledEdit={disabledEdit}
        description={q_description}
        handleChange={(newDesc) => {
          let auxQuestion = question;
          auxQuestion.q_description = newDesc;
          updateQuestion(questionId, auxQuestion);
        }}
        checkOptions={setDescriptionChecked}
      />

      <NumberOfWinnersInput
        questionId={questionId}
        questionType={q_type}
        checkOptions={setNumberOfWinners}
        value={num_of_winners}
        handleNumOfWinners={(e) => {
          let auxQuestion = question;
          auxQuestion.num_of_winners = e;
          updateQuestion(questionId, auxQuestion);
        }}
        minCoteCondition={
          String(num_of_winners) === "NaN" ||
          num_of_winners === 0
        }
        maxCoteCondition={
          parseInt(num_of_winners) > total_options
        }
        numberOfAns={total_options}
      />

      <NumberOfAnswersSetup
        disabledMinAns={
          isSTVQuestion(q_type) || includesInformalAns
        }
        numOfOptions={total_options}
        minAnswers={min_answers}
        handleMinAns={(e) => {
          let auxQuestion = question;
          auxQuestion.min_answers = e;
          updateQuestion(questionId, auxQuestion);
        }}
        maxAnswers={max_answers}
        handleMaxAns={(e) => {
          let auxQuestion = question;
          auxQuestion.max_answers = e;
          updateQuestion(questionId, auxQuestion);
        }}
        checkOptions={setNumberOfAnsChecked}
        disabledEdit={disabledEdit}
        questionId={questionId}
      />

      <AnswersSetup
        editAnswer={(key, newValue) => {
          editAnswer(
            key, newValue, answerObjects, question,
            (newQuestion) => updateQuestion(questionId, newQuestion)
          )
        }}
        editAnswerImg={
          (key, newValue) => editAnswerImg(
            key, newValue, imageObjects, question,
            (newQuestion) => updateQuestion(questionId, newQuestion)
        )
        }
        addAnswer={addAnswer}
        answersWithKey={answerObjects}
        handleRemoveItem={handleRemoveOption}
        question={question}
        questionId={questionId}
        updateQuestion={updateQuestion}
        disabledEdit={disabledEdit}
      />
    </div>
  );
}
