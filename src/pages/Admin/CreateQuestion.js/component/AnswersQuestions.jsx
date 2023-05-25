import { Button } from "react-bulma-components";
import InputQuestion from "./InputQuestion";

function AnswersQuestions(props) {
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
    const input = document.getElementById("fileinput");
    var reader = new FileReader();
    reader.onload = function () {
      let newAns = reader.result.split("\n");
      newAns = newAns.filter((element) => {
        return element !== "";
      });
      let auxQuestion = props.question;
      auxQuestion.closed_options = newAns;
      props.updateQuestions(props.questionId, auxQuestion);
    };
    reader.readAsText(input.files[0]);
  }
  return (
    <>
      {props.question.q_type !== "mixnet_question" && (
        <>
          {" "}
          <div>
            <div className="create-title ml-2 mb-1">Respuestas</div>
            <div id="create-questions">
              {props.answersWithKey.map((item, index) => {
                return (
                  item.value !== "Voto Blanco" &&
                  item.value !== "Voto Nulo" && (
                    <InputQuestion
                      disabledEdit={props.disabledEdit}
                      key={item.key}
                      value={item.value}
                      numberQuestion={item.key}
                      delete={() => {
                        props.handleRemoveItem(item.key);
                      }}
                      onChange={(key, value) => {
                        props.editAnswer(key, value);
                      }}
                    ></InputQuestion>
                  )
                );
              })}
            </div>
          </div>
          {!props.disabledEdit && (
            <div className="is-flex level">
              <div className="is-flex leve-left">
                <Button
                  id={`add-option-${props.questionId}`}
                  className="button-create-question"
                  onClick={() => {
                    props.addAnswer();
                  }}
                >
                  Añadir opción
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {props.question.q_type === "mixnet_question" && (
        <div className="columns">
          <div className="column">
            <div className="field">
              <label className="label">Archivo de preguntas</label>{" "}
              <input
                disabled={props.disabledEdit}
                id="fileinput"
                type="file"
                onChange={filesToString}
              />{" "}
            </div>
            {props.question.closed_options && (
              <div>
                <div className="mb-2">
                  <span onClick={downloadFile}>
                    Existen un total de {props.question.closed_options.length}{" "}
                    respuestas registradas.
                  </span>
                </div>
                {props.question.closed_options.length !== 0 && (
                  <div>
                    <Button
                      className="button-custom"
                      onClick={() => {
                        downloadFile();
                      }}
                    >
                      <span>Descargar archivo</span>
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default AnswersQuestions;
