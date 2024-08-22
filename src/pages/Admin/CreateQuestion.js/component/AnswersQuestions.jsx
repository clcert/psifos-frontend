import { Button } from "react-bulma-components";
import InputQuestion from "./InputQuestion";
import { isMixNetQuestion } from "../../../../utils";

function ClosedAnswersSetup({
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
        <div className="is-flex level">
          <div className="is-flex leve-left">
            <Button
              id={`add-option-${questionId}`}
              className="button-create-question"
              onClick={handleNewAns}
            >
              Añadir opción
            </Button>
          </div>
        </div>
      )}
    </>
  );
}

function MixnetAnswersSetup({
  disabledEdit,
  closedOptions,
  handleFileChange,
  handleDownloadFile,
  q_num
}) {
  return (
    <div>
      <div>
        <div className="field">
          <label className="label">Archivo de preguntas</label>{" "}
          <input
            disabled={disabledEdit}
            id={"fileinput_" + q_num}
            type="file"
            onChange={handleFileChange}
          />{" "}
        </div>
        {closedOptions && (
          <div>
            <div className="mb-2">
              <span onClick={handleDownloadFile}>
                Existen un total de {closedOptions.length} respuestas
                registradas.
              </span>
            </div>
            {closedOptions.length !== 0 && (
              <div>
                <Button className="button-custom" onClick={handleDownloadFile}>
                  <span>Descargar archivo</span>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function AnswersSetup(props) {
  function arrayToString() {
    /**
     * Convert array with string to a only string
     */
    let auxString = "";
    props.question.closed_options.forEach((answer) => {
      auxString = auxString.concat(answer).concat("\n");
    });
    return auxString;
  }

  function downloadFile() {
    /**
     * download a file with answers
     */
    const textToSave = arrayToString();
    let hiddenElement = document.createElement("a");
    hiddenElement.download = `answers.txt`;
    const blob = new Blob([textToSave], {
      type: "text/plain",
    });
    hiddenElement.href = window.URL.createObjectURL(blob);
    hiddenElement.click();
  }

  function filesToString() {
    const input = document.getElementById("fileinput_" + props.questionId);
    var reader = new FileReader();
    reader.onload = function () {
      let newAns = reader.result.split("\n");
      newAns = newAns.filter((element) => {
        return element !== "";
      });
      let auxQuestion = props.question;
      auxQuestion.closed_options = Array.from(new Set(newAns));
      props.updateQuestions(props.questionId, auxQuestion);
    };
    reader.readAsText(input.files[0]);
  }
  return (
    <>
      {!isMixNetQuestion(props.question.q_type) && (
        <ClosedAnswersSetup
          answersWithKey={props.answersWithKey}
          disabledEdit={props.disabledEdit}
          questionId={props.questionId}
          handleRemoveAns={(ans) => props.handleRemoveItem(ans)}
          handleChangeAns={props.editAnswer}
          handleNewAns={props.addAnswer}
        />
      )}

      {isMixNetQuestion(props.question.q_type) && (
        <MixnetAnswersSetup
          disabledEdit={props.disabledEdit}
          handleFileChange={filesToString}
          closedOptions={props.question.closed_options}
          handleDownloadFile={downloadFile}
          q_num={props.questionId}
        />
      )}
    </>
  );
}

export default AnswersSetup;
