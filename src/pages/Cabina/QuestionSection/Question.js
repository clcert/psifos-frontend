import { useState } from "react";
import selectImg from "../../../static/cabina/svg/select-img.svg";
import FinishButton from "../components/Buttons/FinishButton";
import InputCheckbox from "./Questions/InputCheckbox";
import InputRadio from "./Questions/InputRadio";
import NextButton from "../components/Buttons/NextButton";
import PreviousButton from "../components/Buttons/PreviousButton";
import QuestionHeader from "./QuestionHeader";

function Question(props) {
  const [actualQuestion, setActualQuestion] = useState(0);
  const [answers, setAnswers] = useState([]);

  function addAnswer(answer, index) {
    let answersAux = [...answers];
    answersAux[index] = answer;
    setAnswers(answersAux);
  }

  console.log(answers);

  return (
    <div>
      {Object.keys(props.questions).map((key, index) => {
        return (
          <div
            key={key}
            style={{
              display: props.actualQuestion === index ? "block" : "none",
            }}
          >
            <QuestionHeader
              actualQuestion={props.actualQuestion}
              totalQuestions={Object.keys(props.questions).length}
              questions={props.questions[key]}
            />

            <div className="box has-text-left question-box has-text-white is-flex is-justify-content-center">
              <div className="control control-box">
                <div id="">
                  {props.questions[key].min === 1 &&
                  props.questions[key].max === 1 ? (
                    <InputRadio
                      index={index}
                      addAnswer={addAnswer}
                      value={String(index)}
                      answers={props.questions[index]}
                    />
                  ) : (
                    <InputCheckbox
                      index={index}
                      addAnswer={addAnswer}
                      value={String(index)}
                      answers={props.questions[key]}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="columns pt-1 pb-4 buttons-question">
        {props.actualQuestion !== 0 &&
        props.actualQuestion < Object.keys(props.questions).length ? (
          <div className="column is-flex left-button-column">
            <PreviousButton
              action={() => {
                props.nextQuestion(props.actualQuestion - 1);
              }}
            />
          </div>
        ) : (
          <div className="column is-invisible is-flex left-button-column">
            <PreviousButton
              action={() => {
                props.nextQuestion(props.actualQuestion - 1);
              }}
            />
          </div>
        )}

        <div className="column is-hidden-mobile pb-0">
          <figure className="image select-img-wrapper">
            <img id="select-final-img" src={selectImg} alt="" />
          </figure>
        </div>

        {props.actualQuestion < Object.keys(props.questions).length - 1 ? (
          <div className="column is-flex right-button-column">
            <NextButton
              action={() => {
                props.nextQuestion(props.actualQuestion + 1);
              }}
            />
          </div>
        ) : (
          <div className="column is-flex right-button-column">
            <FinishButton
              action={() => {
                props.answersFunction(answers);
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
export default Question;
