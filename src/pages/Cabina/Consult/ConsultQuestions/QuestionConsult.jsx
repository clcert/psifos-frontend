import UniqueSelection from "../ConsultQuestions/Questions/UniqueSelection";
import MultipleSelection from "../ConsultQuestions/Questions/MultipleSelection";
import { useState } from "react";
import { useEffect } from "react";
import ModalPercentage from "../../components/ModalPercentage";
import FinishButton from "../../components/Buttons/FinishButton";

function QuestionConsult(props) {
  /** Component for consult questions */

  /** @state {array} consult answers */
  const [answers, setAnswers] = useState([]);

  /** @state {boolean} percentage modal state */
  const [showModal, setShowModal] = useState(false);

  /** @state {boolean} encryption status */
  const [finished, setFinished] = useState(false);

  function addAnswer(answer, index) {
    /**
     * @param {array} answersAux - consult answers
     * @param {number} index - question index
     *
     * include the responses in the response array for encryption
     */

    let answersAux = [...answers];
    answersAux[index] = answer;
    setAnswers(answersAux);
  }

  useEffect(() => {
    /**
     * Empty arrays are included in each response
     */
    let answersAux = [];
    for (let i = 0; i < props.questions.length; i++) {
      answersAux.push([]);
    }
    setAnswers(answersAux);
  }, []);
  return (
    <>
      {props.questions.map((item, index) => {
        return (
          <div key={index}>
            {item.min_answers === item.max_answers && (
              <UniqueSelection
                addAnswer={addAnswer}
                data={item}
                index={index}
              />
            )}

            {item.min_answers !== item.max_answers && (
              <MultipleSelection
                addAnswer={addAnswer}
                data={item}
                index={index}
              />
            )}
          </div>
        );
      })}
      <div className="column is-flex right-button-column">
        <FinishButton
          action={() => {
            props.encrypQuestions(answers);
            setShowModal(true);
            setFinished(true);
          }}
          answers={answers}
        />
      </div>
      <ModalPercentage
        booth={props.booth}
        show={showModal}
        onHide={() => setShowModal(false)}
        afterEncrypt={() => {
          setShowModal(false);
        }}
      />
    </>
  );
}

export default QuestionConsult;
