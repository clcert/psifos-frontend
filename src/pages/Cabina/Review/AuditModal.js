import $ from "jquery";

function AuditModal(props) {
  return (
    <div className={"modal " + (props.showModal ? "is-active" : "")} id="audit-modal">
      <div
        className="modal-background"
        onClick={() => {
          props.onHide();
        }}
      ></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">IMPORTANTE</h1>
          <p>
            <span className="has-text-weight-bold">
              Este proceso es OPCIONAL y AVANZADO.
            </span>
            <br />
            <br />
            Al auditar tu voto{" "}
            <span className="has-text-weight-bold">
              revelarás las opciones que seleccionaste
            </span>{" "}
            para poder verificar que éstas no fueron modificadas de manera
            fraudulenta.
            <br />
            Al terminar el proceso de auditoría, tendrás que{" "}
            <span className="has-text-weight-bold">
              volver para poder completar el proceso de votación.
            </span>
          </p>
          <p className="has-text-weight-bold pt-4">
            ¿Quieres continuar auditando tu voto?
          </p>
        </section>
        <footer className="modal-card-foot">
          <div className="container">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold"
              onClick={() => {
                props.onHide();
              }}
            >
              <span className="icon">
                <i className="fas fa-2x fa-caret-left"></i>
              </span>
              <span>VOLVER ATRÁS</span>
            </button>
          </div>
          <div className="container">
            <button
              id="proceed-to-audit"
              className="button review-buttons next-button has-text-white has-text-weight-bold"
              onClick={props.audit}
            >
              <span>CONTINUAR</span>
              <span className="icon">
                <i className="fas fa-2x fa-caret-right"></i>
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AuditModal;
