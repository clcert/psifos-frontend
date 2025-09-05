import { backendOpIP } from "../../../../server";

function ModalResultsRelease(props) {
  async function release() {
    const url = backendOpIP + "/" + props.shortName + "/results-release";
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    if (response.status === 200) {
      props.feedback("La elección ha liberado los resultados con exito!", "is-success");
      props.onHide();
    } else {
      props.feedback(
        "Ha ocurrido un problema al liberar los resultaods",
        "is-danger"
      );
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
          <h1 className="title">Liberar resultados</h1>
          <div className="field">
            <label className="">
              ¿Estas seguro que quieres liberar los resultados?
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
              id="button-init-election"
              className="button review-buttons previous-button has-text-white has-text-weight-bold level-right"
              onClick={release}
            >
              <span>LIBERAR</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ModalResultsRelease;
