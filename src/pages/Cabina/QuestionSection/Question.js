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

  return (
    <div>
      {Object.keys(props.questions).map((key, index) => {
        return (
          <div
            key={key}
            style={{
              display: actualQuestion === index ? "block" : "none",
            }}
          >
            <QuestionHeader
              actualQuestion={actualQuestion}
              totalQuestions={Object.keys(props.questions).length}
              questions={props.questions[key]}
            />

            <div className="box has-text-left question-box has-text-white is-flex is-justify-content-center">
              <div className="control control-box">
                <div id="">
                  {Object.keys(props.questions[key].answers).map(
                    (key2, index2) => {
                      return (
                        <div key={key2}>
                          {props.questions[key].min === 1 &&
                          props.questions[key].max === 1 ? (
                            <InputRadio
                              value={String(index)}
                              answer={props.questions[key].answers[key2]}
                            />
                          ) : (
                            <InputCheckbox
                              value={String(index)}
                              answer={props.questions[key].answers[key2]}
                            />
                          )}
                          &nbsp;&nbsp;
                          <span style={{ fontSize: "12pt" }}>
                            [
                            <a
                              target="_blank"
                              href="{$T.question.answer_urls[$T.answer_ordering[$T.answer$index]]}"
                              rel="noopener noreferrer"
                            >
                              more info
                            </a>
                            ]
                          </span>
                        </div>
                      );
                    }
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="columns pt-1 pb-4 buttons-question">
        {actualQuestion != 0 &&
        actualQuestion < Object.keys(props.questions).length ? (
          <div className="column is-flex left-button-column">
            <PreviousButton
              action={() => {
                setActualQuestion(actualQuestion - 1);
              }}
            />
          </div>
        ) : (
          <div className="column is-invisible is-flex left-button-column">
            <PreviousButton
              action={() => {
                setActualQuestion(actualQuestion - 1);
              }}
            />
          </div>
        )}

        <div className="column is-hidden-mobile pb-0">
          <figure className="image select-img-wrapper">
            <img id="select-final-img" src={selectImg} />
          </figure>
        </div>

        {actualQuestion < Object.keys(props.questions).length - 1 ? (
          <div className="column is-flex right-button-column">
            <NextButton
              action={() => {
                console.log("next");
                setActualQuestion(actualQuestion + 1);
              }}
            />
          </div>
        ) : (
          <div className="column is-flex right-button-column">
            <FinishButton action={props.finish} />
          </div>
        )}
      </div>
    </div>
  );
}
export default Question;
