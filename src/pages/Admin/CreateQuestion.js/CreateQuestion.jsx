import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { backendOpIP } from "../../../server";
import { getElection } from "../../../services/election";
import SubNavbar from "../component/SubNavbar";
import QuestionsForms from "./component/QuestionsForms";
import { useDispatch, useSelector } from "react-redux";
import { setElection } from "../../../store/slices/electionSlice";
import { electionStatus } from "../../../constants";

function CreateQuestion(props) {
  /**
   * view that is responsible for creating a question
   */

  const dispatch = useDispatch();
  const election = useSelector((state) => state.election.actualElection);

  /** @state {number} number of questions */
  const [questionCantidad, setQuestionCantidad] = useState(1);

  /** @state {array} array containing the questions */
  const [question, setQuestion] = useState([]);

  /** @state {string} alert message for state of creation */
  const [alertMessage, setAlertMessage] = useState("");

  /** @state {string} color state for state of creation */
  const [colorAlert, setColorAlert] = useState("");

  const [disabledEdit, setDisabledEdit] = useState("");

  const [optionsChecked, setOptionsChecked] = useState(true);

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  const initComponent = useCallback((election) => {
    if (election.questions !== null) {
      const processedQuestions = processQuestions(election.questions);
      setQuestion(processedQuestions);
    }
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
    let questionAux = question.concat({
      q_num: questionCantidad,
      q_type: "CLOSED",
      q_text: "",
      q_description: "",
      total_options: 0,
      total_closed_options: 0,
      closed_options: [],
      num_of_winners: 1,
      min_answers: 1,
      max_answers: 1,
      include_blank_null: true,
      group_votes: false,
    });

    setQuestion(questionAux);
    setQuestionCantidad(questionCantidad + 1);
  }

  const processQuestions = (questions) => {
    return questions.map((question, index) => ({
      ...question, // Copia todas las propiedades de la pregunta original
      q_num: index,
      q_type: question.q_type || "CLOSED",
      q_text: question.q_text || "",
      q_description: question.q_description || "",
      total_options: question.total_options || 3,
      total_closed_options: question.total_closed_options || 2,
      closed_options: question.closed_options_list || [],
      num_of_winners: question.num_of_winners || 1,
      min_answers: question.min_answers || 1,
      max_answers: question.max_answers || 1,
      include_blank_null: question.include_blank_null === "True" ? true : false,
      group_votes: question.group_votes === "True" ? true : false,
    }));
  };

  function removeQuestion(q_num) {
    /**
     * remove a question from array
     * @param {number} q_num
     */
    let newQuestion = [];
    for (let i = 0; i < question.length; i++) {
      if (question[i].q_num !== q_num) {
        newQuestion.push(question[i]);
      }
    }
    setQuestion(newQuestion);
  }

  function updateQuestions(key, newValue) {
    /* * edit the answers of a question
     * @param {number} key number of answer
     * @param {string} newValue new value for the answer
     */

    newValue.total_closed_options = newValue.closed_options.length;
    newValue.total_options = newValue.closed_options.length;
    let auxQuestion = [...question];
    for (let i = 0; i < auxQuestion.length; i++) {
      if (auxQuestion[i].q_num === key) {
        auxQuestion[i] = newValue;
      }
      setQuestion(auxQuestion);
    }
  }

  function checkQuestions() {
    /**
     * check if the questions are valid
     * @returns {boolean} true if the questions are valid
     */

    let isValid = true;
    question.forEach((q) => {
      if (!q.q_text) {
        isValid = false;
      }
    });
    if (!optionsChecked) {
      isValid = false;
    }
    return isValid;
  }
  async function sendQuestions() {
    /**
     * send the questions to the server
     */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    const auxQuestion = [...question];

    auxQuestion.forEach((value) => {
      value.closed_options = value.closed_options.filter((option) => {
        return !["Voto Blanco", "Voto Nulo"].includes(option);
      });

      if (value.include_blank_null) {
        const answerBlankNull = ["Voto Blanco", "Voto Nulo"];
        value.closed_options = [...value.closed_options, ...answerBlankNull];
      }
      value.total_closed_options = value.closed_options.length;
    });

    setQuestion(auxQuestion);
    if (checkQuestions()) {
      const token = localStorage.getItem("token");
      const resp = await fetch(backendOpIP + "/create-questions/" + shortName, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: auxQuestion,
        }),
      });
      if (resp.status === 200) {
        setAlertMessage("Preguntas creadas con éxito!");
        setColorAlert("is-success");
      } else {
        const data = await resp.json();
        setAlertMessage(data["message"]);
        setColorAlert("is-danger");
      }
    } else {
      setAlertMessage("Hay errores en el formulario");
      setColorAlert("is-danger");
    }
  }

  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <TitlePsifos namePage="Creación de Preguntas" />
        </div>
      </section>

      <SubNavbar active={1} />

      <section
        className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
        id="create-question-section"
      >
        <div className="question-content">
          {alertMessage !== "" && (
            <div className={"notification " + colorAlert + " is-light"}>
              <button
                onClick={() => setAlertMessage("")}
                className="delete"
              ></button>
              {alertMessage}
            </div>
          )}
          {question.map((item, index) => {
            return (
              <QuestionsForms
                key={index}
                election={election}
                disabledEdit={disabledEdit}
                questionId={item.q_num}
                question={item}
                updateQuestions={updateQuestions}
                remove={() => {
                  removeQuestion(item.q_num);
                }}
                checkOptions={(state) => {
                  setOptionsChecked(state);
                }}
              />
            );
          })}

          <div className="row is-centered mt-5">
            <div className="col-sm d-flex justify-content-center mt-3">
              <Button className="btn-fixed">
                <Link
                  style={{ textDecoration: "none", color: "#363636" }}
                  to={"/psifos/admin/" + shortName + "/panel"}
                >
                  Volver inicio
                </Link>
              </Button>
            </div>
            <div className="col-sm d-flex justify-content-center mt-3">
              <Button
                id="add-question"
                disabled={disabledEdit}
                className="btn-fixed"
                onClick={() => addQuestion()}
              >
                Añadir pregunta
              </Button>
            </div>
            <div className="col-sm d-flex justify-content-center mt-3">
              <Button
                id="button-save-questions"
                disabled={disabledEdit}
                className="btn-fixed"
                onClick={() => sendQuestions()}
              >
                Guardar Preguntas
              </Button>
            </div>
          </div>
        </div>
      </section>
      <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
    </div>
  );
}

export default CreateQuestion;
