import { backendIP } from "../../../../server";

function ModalCombineTally(props) {
  async function combine() {
    const url = backendIP + "/" + props.uuid + "/combine-decryptions";
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
      props.combineChange(true);
    } else {
      props.feedback(data.message, "is-danger");
      
    }
    props.onHide();
  }

  return (
    <div
      className={"modal " + (props.show ? "is-active" : "")}
      id="extend-modal"
    >
      <div className="modal-background" onClick={props.onHide}></div>

      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">Combinar Desencriptaciones</h1>
          <div className="field">
            <label className="">
              Estas seguro que quieres combinar las desencriptaciones de la votación?
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
              onClick={combine}
            >
              <span>COMBINAR</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ModalCombineTally;
