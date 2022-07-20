import { backendIP } from "../../../../server";
import { useParams } from "react-router-dom";
import { useState } from "react";

function UploadModal(props) {
  /**
   * Modal for upload voters from a file
   */

  /** @state {bool} modal state to extend voting */
  const [uploadState, setUploadState] = useState(false);

  /** @state {string} status to see if it finished uploading */
  const [finishedUpload, setFinishedUpload] = useState(false);

  /** @state {string} status to see if an error occurred */
  const [errorUpload, setErrorUpload] = useState(false);

  /** @state {string} message for finish state */
  const [messageFinish, setMessageFinish] = useState("");

  /** @urlParam {string} uuid for election */
  const { uuid } = useParams();

  async function sendVoter() {
    /**
     * async function to send the voters to the server
     */

    try {
      setUploadState(true);
      let data = new FormData();
      const input = document.getElementById("fileinput");
      data.append("file", input.files[0]);
      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendIP + "/" + props.uuid + "/send-voters", {
        method: "POST",
        headers: {
          "x-access-tokens": token,
        },
        body: data,
      });
      setUploadState(false);
      setFinishedUpload(true);
      const jsonResponse = await resp.json();
      if (resp.status == 200) {
        setMessageFinish("Votantes subidos con exito");
      } else {
        setErrorUpload(true);
        setMessageFinish("Ha ocurrido un error");
      }
    } catch (error) {
      setUploadState(false);
      setFinishedUpload(true);
      setErrorUpload(true);
      setMessageFinish("Ha ocurrido un error");
    }
  }
  if (!finishedUpload) {
    return (
      <div
        className={"modal " + (props.show ? "is-active" : "")}
        id="extend-modal"
      >
        <div className="modal-background" onClick={props.onHide}></div>
        {uploadState ? (
          <div className="modal-card">
            <section className="modal-card-body">
              <h1 className="title">Los votantes se estan subiendo..</h1>
              <div className="field">
                <label className="label label-form-election">
                  Espere un momento...
                </label>
              </div>
            </section>
          </div>
        ) : (
          <div className="modal-card">
            <section className="modal-card-body">
              <h1 className="title">Subir Votantes</h1>
              <div className="field">
                <label className="label label-form-election">
                  Suba el archivo csv..
                </label>
                <div className="control">
                  <input
                    className="input input-calendar"
                    type="file"
                    id="fileinput"
                    placeholder="Fecha de inicio"
                  />
                </div>
              </div>
            </section>
            <footer className="modal-card-foot">
              <div className="container level">
                <button
                  className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
                  onClick={() => window.location.reload()}
                >
                  <span>VOLVER ATRÁS</span>
                </button>

                <button
                  className="button review-buttons previous-button has-text-white has-text-weight-bold level-right"
                  onClick={sendVoter}
                >
                  <span>SUBIR</span>
                </button>
              </div>
            </footer>
          </div>
        )}
      </div>
    );
  } else {
    return (
      <div
        className={"modal " + (props.show ? "is-active" : "")}
        id="extend-modal"
      >
        <div className="modal-background" onClick={props.onHide}></div>

        <div className="modal-card">
          {!errorUpload ? (
            <section className="modal-card-body">
              <h1 className="title">Proceso terminado con exito</h1>
              <div className="field">
                <label className="label label-form-election">
                  Los votantes se han subido con exito
                </label>
              </div>
            </section>
          ) : (
            <section className="modal-card-body">
              <h1 className="title">Ha ocurrido un error</h1>
              <div className="field">
                <label className="label label-form-election">
                  Los votantes no han sido subidos, intente nuevamente
                </label>
              </div>
            </section>
          )}

          <footer className="modal-card-foot">
            <div className="container level">
              <button
                className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
                onClick={() => window.location.reload()}
              >
                <span>VOLVER ATRÁS</span>
              </button>

              <button
                className="button review-buttons previous-button has-text-white has-text-weight-bold level-right"
                onClick={() => {
                  setFinishedUpload(false);
                  setErrorUpload(false);
                }}
              >
                <span>SUBIR VOTANTES</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    );
  }
}

export default UploadModal;
