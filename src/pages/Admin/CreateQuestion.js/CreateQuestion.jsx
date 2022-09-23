import { useEffect, useState } from "react";
import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { backendIP } from "../../../server";
import { getElection } from "../../../services/election";
import SubNavbar from "../component/SubNavbar";
import QuestionsForms from "./component/QuestionsForms";

function CreateQuestion(props) {
  /**
   * view that is responsible for creating a question
   */

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

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    getElection(uuid).then((resp) => {
      if (resp.jsonResponse.questions !== "") {
        setQuestions(JSON.parse(resp.jsonResponse.questions));
      }
      setDisabledEdit(resp.jsonResponse.election_status !== "Setting up");
    });
  }, []);

  function addQuestion() {
    /**
     * add new question to array allowing rendering
     */
    let questionAux = question.concat({
      key: questionCantidad,
      q_type: "closed_question",
      q_text: "",
      q_description: "",
      total_options: 0,
      total_closed_options: 0,
      closed_options: [],
      open_option_max_size: 50,
      total_open_options: 0,
      min_answers: 1,
      max_answers: 1,
    });

    setQuestion(questionAux);
    setQuestionCantidad(questionCantidad + 1);
  }

  function setQuestions(questions) {
    /**
     * add keys to the question
     * @param {object} question
     * @returns {object} question with keys
     */
    let questionAux = questions;
    questions.map((question, index) => {
      question.key = index;
      question.q_type = question.q_type ? question.q_type : "closed_question";
      question.q_text = question.q_text ? question.q_text : "";
      question.q_description = question.q_description
        ? question.q_description
        : "";
      question.total_options = question.total_options
        ? question.total_options
        : 3;
      question.total_closed_options = question.total_closed_options
        ? question.total_closed_options
        : 2;
      question.closed_options = question.closed_options
        ? question.closed_options
        : [];
      question.open_option_max_size = question.open_option_max_size
        ? question.open_option_max_size
        : 50;
      question.total_open_options = question.total_open_options
        ? question.total_open_options
        : 1;
      question.min_answers = question.min_answers ? question.min_answers : 1;
      question.max_answers = question.max_answers ? question.max_answers : 1;
    });
    setQuestion(questionAux);
  }

  function removeQuestion(key) {
    /**
     * remove a question from array
     * @param {number} key
     */
    let newQuestion = [];
    for (let i = 0; i < question.length; i++) {
      if (question[i].key !== key) {
        newQuestion.push(question[i]);
      }
    }
    setQuestion(newQuestion);
  }

  function editAnswers(key, newName, newValue) {
    /**
     * edit the answers of a question
     * @param {number} key number of answer
     * @param {string} newName new name for the answer
     * @param {string} newValue new value for the answer
     */

    let auxQuestion = [...question];
    for (let i = 0; i < auxQuestion.length; i++) {
      if (auxQuestion[i].key === key) {
        auxQuestion[i].q_text = newName;
        auxQuestion[i].closed_options = [];
        auxQuestion[i].total_closed_options = newValue.length;
        auxQuestion[i].total_options = newValue.length;
        for (let j = 0; j < newValue.length; j++) {
          auxQuestion[i].closed_options[j] = newValue[j].value;
        }
      }
    }
    setQuestion(auxQuestion);
  }

  function editType(key, newType) {
    /**
     * edit the type of a question
     * @param {number} key number of question
     *
     * @param {string} newType new type for the question
     * @returns {void}
     */

    let auxQuestion = [...question];
    for (let i = 0; i < auxQuestion.length; i++) {
      if (auxQuestion[i].key === key) {
        auxQuestion[i].q_type = newType;
      }
    }
    setQuestion(auxQuestion);
  }

  function checkQuestions() {
    /**
     * check if the questions are valid
     * @returns {boolean} true if the questions are valid
     */
    if (!optionsChecked) {
      return false;
    }
    return true;
  }
  async function sendQuestions() {
    /**
     * send the questions to the server
     */

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    if (checkQuestions()) {
      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendIP + "/create-questions/" + uuid, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question,
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
  function setOptionsQuestions(
    key,
    description,
    openSize,
    openOptions,
    minAnswers,
    maxAnswers
  ) {
    /**
     * set the options of a question
     * @param {number} key number of question
     * @param {string} description description of the question
     * @param {number} openSize max size of the open question
     * @param {array} openOptions options of the open question
     */

    let auxQuestion = [...question];
    for (let i = 0; i < auxQuestion.length; i++) {
      if (auxQuestion[i].key === key) {
        auxQuestion[i].q_description = description;
        auxQuestion[i].open_option_max_size = openSize;
        auxQuestion[i].total_open_options = openOptions;
        auxQuestion[i].min_answers = minAnswers;
        auxQuestion[i].max_answers = maxAnswers;
      }
    }
    setQuestion(auxQuestion);
  }

  return (
    <div id="content-create-question">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Creación de Preguntas" />
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
                disabledEdit={disabledEdit}
                key={item.key}
                question={item}
                changeQuestion={(name, question) =>
                  editAnswers(item.key, name, question)
                }
                changeOptions={(
                  description,
                  openSize,
                  openOptions,
                  minAnswers,
                  maxAnswers
                ) => {
                  setOptionsQuestions(
                    item.key,
                    description,
                    openSize,
                    openOptions,
                    minAnswers,
                    maxAnswers
                  );
                }}
                remove={() => {
                  removeQuestion(item.key);
                }}
                editType={(newType) => {
                  editType(item.key, newType);
                }}
                checkOptions={(state) => {
                  setOptionsChecked(state);
                }}
              />
            );
          })}

          <div className="columns is-centered mt-5 level">
            <Button className="level-left mr-6">
              <Link
                style={{ textDecoration: "none", color: "#363636" }}
                to={"/admin/" + uuid + "/panel"}
              >
                Volver inicio
              </Link>
            </Button>
            <Button
              disabled={disabledEdit}
              className="level-center mr-6"
              onClick={() => addQuestion()}
            >
              Añadir pregunta
            </Button>

            <Button
              disabled={disabledEdit}
              className="level-right"
              onClick={() => sendQuestions()}
            >
              Guardar Preguntas
            </Button>
          </div>
        </div>
      </section>
      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default CreateQuestion;
