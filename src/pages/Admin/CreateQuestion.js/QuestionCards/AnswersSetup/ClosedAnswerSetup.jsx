import InputQuestion from "../../component/InputQuestion";
import AddAnswerButton from "./AddAnswerButton";

export default function ClosedAnswersSetup({
    answersWithKey,
    disabledEdit,
    questionId,
    handleRemoveAns,
    handleChangeAns,
    handleNewAns,
  }) {
    return (
      <>
        {" "}
        <div>
          <div className="create-title mb-1">Respuestas</div>
          <div id="create-questions">
            {answersWithKey.map((item, index) => {
              return (
                item.value !== "Voto Blanco" &&
                item.value !== "Voto Nulo" && (
                  <InputQuestion
                    disabledEdit={disabledEdit}
                    key={item.key}
                    value={item.value}
                    numberQuestion={item.key}
                    questionId={questionId}
                    delete={() => handleRemoveAns(item.key)}
                    onChange={handleChangeAns}
                  />
                )
              );
            })}
          </div>
        </div>
        {!disabledEdit && (
         <AddAnswerButton
          questionId={questionId}
          handleNewAns={handleNewAns}
         />
        )}
      </>
    );
  }