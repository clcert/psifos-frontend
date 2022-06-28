import { backendIP } from "../../../../server";

function ModalCloseElection(props) {
  async function closeElection() {
    const url = backendIP + "/" + props.uuid + "/end-election";
    const token = sessionStorage.getItem("token");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "x-access-tokens": token,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      props.feedback(data.message, "is-success");
      props.endChange(true);
      props.onHide();
    } else {
      props.feedback(data.message, "is-danger");
    }
  }
  return (
    <div
      className={"modal " + (props.show ? "is-active" : "")}
      id="extend-modal"
    >
      <div className="modal-background" onClick={props.onHide}></div>

      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">Cerrar Elección</h1>
          <div className="field">
            <label className="">
              Estas seguro que quieres cerrar la votación?
            </label>
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
              onClick={closeElection}
            >
              <span>CERRAR</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ModalCloseElection;
