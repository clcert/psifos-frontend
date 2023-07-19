import TimeField from "react-simple-timefield";

function ExtendElection(props) {
  return (
    <div
      className={"modal " + (props.show ? "is-active" : "")}
      id="extend-modal"
    >
      <div className="modal-background" onClick={props.onHide}></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">Extender Votación</h1>

          <div className="field">
            <label className="label label-form-election">
              Fecha de extención
            </label>
            <div className="control">
              <input
                className="input input-calendar"
                type="date"
                placeholder="Fecha de inicio"
              />
            </div>
          </div>
          <TimeField style={{ width: "46px" }} colon=":" />
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
              onClick={props.onHide}
            >
              <span>EXTENDER</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ExtendElection;
