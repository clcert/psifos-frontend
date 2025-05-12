import { backendOpIP } from "../../../../server";

function ModalTally(props) {
  async function computeTally() {
    const url = backendOpIP + "/" + props.shortName + "/compute-tally";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 200) {
      props.feedback(
        "El tally encriptado ha sido computado con exito!",
        "is-success"
      );
      props.tallyChange(true);
      props.onHide();
    } else {
      props.feedback(
        "Ha ocurrido un problema al intentar computar el tally",
        "is-danger"
      );
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
              id="button-compute-tally"
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
