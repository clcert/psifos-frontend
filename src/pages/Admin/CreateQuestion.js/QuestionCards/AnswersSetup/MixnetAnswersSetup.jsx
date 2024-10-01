import { Button } from "react-bulma-components";

export default function MixnetAnswersSetup({
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