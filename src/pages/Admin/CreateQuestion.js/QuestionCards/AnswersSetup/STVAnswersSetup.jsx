import InputQuestion from "../../component/InputQuestion";
import AddAnswerButton from "./AddAnswerButton";
import { isInformalAns } from "./utils";

export default function STVAnswersSetup({
    answersWithKey,
    disabledEdit,
    questionId,
    handleRemoveAns,
    handleChangeAns,
    handleNewAns,
    imageToBytes,
  }) {
    return (
      <>
        {" "}
        <div>
          <div className="create-title mb-1">Respuestas</div>
          <div id="create-questions">
            {answersWithKey.map((item) => {
              return (
                isInformalAns(item.value) && (
                  <div
                    style={{ display: "flex" }}
                    key={`question-${questionId}-option-${item.key}`}
                  >
                    <InputQuestion
                      disabledEdit={disabledEdit}
                      key={item.key}
                      value={item.value}
                      numberQuestion={item.key}
                      questionId={questionId}
                      delete={() => handleRemoveAns(item.key)}
                      onChange={handleChangeAns}
                    />
                    <div className="field">
                      <input
                        disabled={false}
                        id={`fileinput_question_${questionId}_option_${item.key}`}
                        type="file"
                        onChange={(e) => {
                          imageToBytes(
                            questionId, item.key
                          )}
                        }
                      />
                    </div>
                  </div>
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