import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getElection } from "../../../services/election";
import { useDispatch, useSelector } from "react-redux";
import { setElection } from "../../../store/slices/electionSlice";
import { electionStatus } from "../../../constants";
import {
  parseSavedQuestionList, getDefaultQuestion,
  postQuestionList, isNotEmpty,
} from "./utils";
import ViewQuestionsMainInterface from "./ViewQuestionsMainInterface";
import ViewQuestionsButtons from "./ViewQuestionsButtons";
import QuestionCards from "./QuestionCards/QuestionCards";
import ViewQuestionsAlert from "./ViewQuestionsAlert";

const checkQuestionList = (questionList, optionsChecked) => {
  /**
 * check if the questions are valid
 * @returns {boolean} true if the questions are valid
 */
  let isValid = true;
  questionList.forEach((q) => {
    let nSpecifications = q.options_specifications.length
    let nFormalOptions = q.total_closed_options
    nFormalOptions = q.include_blank_null && nFormalOptions - 2
    if (!q.q_text || nFormalOptions !== nSpecifications) {
      isValid = false;
    }
  });
  if (!optionsChecked) {
    isValid = false;
  }
  return isValid;
}

export default function ViewQuestions(props) {
  /**
   * view that is responsible for creating a question
   */

  const dispatch = useDispatch();
  const election = useSelector((state) => state.election.actualElection);

  const [nQuestions, setNQuestions] = useState(1);
  const [questionList, setQuestionList] = useState([]);
  const [alertMessage, setAlertMessage] = useState("");
  const [colorAlert, setColorAlert] = useState("");
  const [disabledEdit, setDisabledEdit] = useState("");
  const [optionsChecked, setOptionsChecked] = useState(true);

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  const initComponent = useCallback((election) => {
    election.questions !== null && setQuestionList(
      parseSavedQuestionList(
        JSON.parse(election.questions)
      )
    )
    setDisabledEdit(election.election_status !== electionStatus.settingUp);
  }, []);

  useEffect(() => {
    if (Object.keys(election).length === 0) {
      getElection(shortName).then((resp) => {
        dispatch(setElection(resp.jsonResponse));
        initComponent(resp.jsonResponse);
      });
    } else {
      initComponent(election);
    }
  }, [shortName, dispatch, election, initComponent]);

  function addQuestion() {
    /**
     * add new question to array allowing rendering
     */
    let questionListAux = questionList.concat(
      getDefaultQuestion(nQuestions)
    );
    setQuestionList(questionListAux);
    setNQuestions(nQuestions + 1);
  }

  function removeQuestion(key) {
    /**
     * remove a question from array
     * @param {number} key
     */
    let newQuestionList = [];
    for (let i = 0; i < questionList.length; i++) {
      if (questionList[i].key !== key) {
        newQuestionList.push(questionList[i]);
      }
    }
    setQuestionList(newQuestionList);
  }

  function updateQuestion(key, newValue) {
    const nClosedOptions = newValue.closed_options.length
    const includeInformal = newValue.include_blank_null
    newValue.total_closed_options = nClosedOptions;
    newValue.total_options = includeInformal ? nClosedOptions - 2 : nClosedOptions;
    
    let auxQuestionList = [...questionList];
    for (let i = 0; i < auxQuestionList.length; i++) {
      if (auxQuestionList[i].key === key) {
        auxQuestionList[i] = newValue;
      }
      setQuestionList(auxQuestionList);
    }
  }

  async function sendQuestions() {
    /**
     * send the questions to the server
     */
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    
    const auxQuestions = [...questionList];

    if (checkQuestionList(questionList, optionsChecked)) {
      postQuestionList(
        shortName,
        auxQuestions,
        () => {
          setAlertMessage("Preguntas creadas con éxito!");
          setColorAlert("is-success");
        },
        (resp) => {
          const data = resp.json();
          setAlertMessage(data["message"]);
          setColorAlert("is-danger");
        }
      )
    } else {
      setAlertMessage("Hay errores en el formulario");
      setColorAlert("is-danger");
    }
  }

  return (
    <ViewQuestionsMainInterface>
      <div className="question-content">
        {isNotEmpty(alertMessage) && <ViewQuestionsAlert
          colorAlert={colorAlert}
          closeAlert={() => setAlertMessage("")}
          alertMessage={alertMessage}
        />}
        <QuestionCards
          questionList={questionList}
          election={election}
          disabledEdit={disabledEdit}
          updateQuestion={updateQuestion}
          removeQuestion={removeQuestion}
          handleOptionsChecked={setOptionsChecked}
        />
        <ViewQuestionsButtons
          shortName={shortName}
          disabledEdit={disabledEdit}
          addQuestion={addQuestion}
          sendQuestions={sendQuestions}
        />
      </div>
    </ViewQuestionsMainInterface>
  );
}
