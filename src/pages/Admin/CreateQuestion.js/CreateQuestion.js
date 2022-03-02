import { useState } from "react";
import { Button } from "react-bulma-components";
import { Link } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import InputQuestion from "./component/InputQuestion";
import QuestionsForms from "./component/QuestionsForms";

function CreateQuestion(props) {
  const [questionCantidad, setQuestionCantidad] = useState(1);
  const [question, setQuestion] = useState([]);

  function addQuestion() {
    let questionAux = question.concat({
      key: questionCantidad,
      value: "",
      correct: false,
      delete: false,
    });

    setQuestion(questionAux);
    setQuestionCantidad(questionCantidad + 1);
  }

  function removeQuestion(key) {
    console.log(question);
    let newQuestion = [];
    for (let i = 0; i < question.length; i++) {
      if (question[i].key !== key) {
        newQuestion.push(question[i]);
      }
    }
    console.log(newQuestion);
    setQuestion(newQuestion);
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

            <Button className="level-right" onClick={() => addQuestion()}>
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
