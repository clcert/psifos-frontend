import { useEffect, useState } from "react";
import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { backendIP } from "../../../server";
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

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    async function getQuestions() {
      /**
       * async function to get the questions
       */

      const token = sessionStorage.getItem("token");
      const response = await fetch(backendIP + "/get_questions/" + uuid, {
        method: "GET",
        headers: {
          "x-access-tokens": token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();
      if (data.hasOwnProperty("question")) {
        setQuestion(data.question);
      }
    }
    getQuestions();
  }, []);

  function addQuestion() {
    /**
     * add new question to array allowing rendering
     */
    let questionAux = question.concat({
      key: questionCantidad,
      choice_type: "approval",
      question: "",
      answers: [],
      answer_urls: [],
      min: 1,
      max: 1,
    });

    setQuestion(questionAux);
    setQuestionCantidad(questionCantidad + 1);
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
        auxQuestion[i].answers = newValue;
        auxQuestion[i].question = newName;
      }
    }
    setQuestion(auxQuestion);
  }

  function editMinMax(key, newMin, newMax) {
    /**
     * edit the min and max of a question
     * @param {number} key number of answer
     * @param {number} newMin new min for the answer
     * @param {number} newMax new max for the answer
     */

    let auxQuestion = [...question];
    for (let i = 0; i < auxQuestion.length; i++) {
      if (auxQuestion[i].key === key) {
        auxQuestion[i].min = newMin;
        auxQuestion[i].max = newMax;
      }
    }
    setQuestion(auxQuestion);
  }

  async function sendQuestions() {
    /**
     * send the questions to the server
     */

    const token = sessionStorage.getItem("token");
    const resp = await fetch(backendIP + "/create_questions/" + uuid, {
      method: "POST",
      headers: {
        "x-access-tokens": token,
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
  }

  return (
    <div id="content-create-question">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Creación de Preguntas" />
        </div>
      </section>

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
                key={item.key}
                question={item}
                changeQuestion={(name, question) =>
                  editAnswers(item.key, name, question)
                }
                changeMinMax={(min, max) => editMinMax(item.key, min, max)}
                remove={() => {
                  removeQuestion(item.key);
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
            <Button className="level-center mr-6" onClick={() => addQuestion()}>
              Añadir pregunta
            </Button>

            <Button className="level-right" onClick={() => sendQuestions()}>
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
