import { backendIP } from "../../../../server";

function ModalTally(props) {
  async function computeTally() {
    const url = backendIP + "/" + props.uuid + "/compute-tally";
    const token = sessionStorage.getItem("token");
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    if (response.status === 200) {
      props.feedback(data.message, "is-success");
      props.tallyChange(true);
      props.onHide();
    } else {
      props.feedback(data.message, "is-danger");
      props.onHide();
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
          <h1 className="title">Computar Tally</h1>
          <div className="field">
            <label className="">
              Estas seguro que quieres computar el tally de la votación?
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
              onClick={computeTally}
            >
              <span>COMPUTAR</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ModalTally;
