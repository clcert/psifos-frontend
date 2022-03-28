import { useEffect, useState } from "react";
import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { backendIP } from "../../../server";
import QuestionsForms from "./component/QuestionsForms";

function CreateQuestion(props) {
  const [questionCantidad, setQuestionCantidad] = useState(1);
  const [question, setQuestion] = useState([]);

  const { uuid } = useParams();

  useEffect(() => {
    async function getQuestions() {
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
      type: "unic",
      name: "",
      value: [],
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
    let auxQuestion = [...question];
    for (let i = 0; i < auxQuestion.length; i++) {
      if (auxQuestion[i].key === key) {
        auxQuestion[i].value = newValue;
        auxQuestion[i].name = newName;
      }
    }
    setQuestion(auxQuestion);
  }

  async function sendQuestions() {
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
    const data = await resp.json();
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
          {question.map((item, index) => {
            return (
              <QuestionsForms
                key={item.key}
                question={item}
                changeQuestion={(name, question) =>
                  editAnswers(item.key, name, question)
                }
                remove={() => {
                  removeQuestion(item.key);
                }}
              />
            );
          })}

          <div className="columns is-centered mt-5 level">
            <Button className="level-left mr-6">
              <Link to="/admin/home">Volver inicio</Link>
            </Button>
            <Button className="level-center mr-6" onClick={() => addQuestion()}>
              Añadir pregunta
            </Button>

            <Button className="level-right" onClick={() => sendQuestions()}>
              Crear Preguntas
            </Button>
          </div>
        </div>
      </section>
      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default CreateQuestion;
