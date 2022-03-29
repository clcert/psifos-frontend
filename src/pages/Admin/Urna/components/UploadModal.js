import { backendIP } from "../../../../server";
import { useParams } from "react-router-dom";

function UploadModal(props) {
  const { uuid } = useParams();

  async function sendVoter() {
    let data = new FormData();
    const input = document.getElementById("fileinput");
    data.append("file", input.files[0]);
    const token = sessionStorage.getItem("token");
    const resp = await fetch(backendIP + "/" + uuid + "/send_voters", {
      method: "POST",
      headers: {
        "x-access-tokens": token,
      },
      body: data,
    });
    const jsonResponse = await resp.json();
  }
  return (
    <div
      className={"modal " + (props.show ? "is-active" : "")}
      id="extend-modal"
    >
      <div className="modal-background" onClick={props.onHide}></div>
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
                id = "fileinput"
                placeholder="Fecha de inicio"
              />
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="container level">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
              onClick={props.onHide}
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
    </div>
  );
}

export default UploadModal;
