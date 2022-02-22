import $ from "jquery";

function AuditModal(props) {
  return (
    <div class={"modal " + (props.showModal ? "is-active" : "")} id="audit-modal">
      <div
        class="modal-background"
        onClick={() => {
          props.onHide();
        }}
      ></div>
      <div class="modal-card">
        <section class="modal-card-body">
          <h1 class="title">IMPORTANTE</h1>
          <p>
            <span class="has-text-weight-bold">
              Este proceso es OPCIONAL y AVANZADO.
            </span>
            <br />
            <br />
            Al auditar tu voto{" "}
            <span class="has-text-weight-bold">
              revelarás las opciones que seleccionaste
            </span>{" "}
            para poder verificar que éstas no fueron modificadas de manera
            fraudulenta.
            <br />
            Al terminar el proceso de auditoría, tendrás que{" "}
            <span class="has-text-weight-bold">
              volver para poder completar el proceso de votación.
            </span>
          </p>
          <p class="has-text-weight-bold pt-4">
            ¿Quieres continuar auditando tu voto?
          </p>
        </section>
        <footer class="modal-card-foot">
          <div class="container">
            <button
              class="button review-buttons previous-button has-text-white has-text-weight-bold"
              onClick={() => {
                props.onHide();
              }}
            >
              <span class="icon">
                <i class="fas fa-2x fa-caret-left"></i>
              </span>
              <span>VOLVER ATRÁS</span>
            </button>
          </div>
          <div class="container">
            <button
              id="proceed-to-audit"
              class="button review-buttons next-button has-text-white has-text-weight-bold"
              onClick={props.audit}
            >
              <span>CONTINUAR</span>
              <span class="icon">
                <i class="fas fa-2x fa-caret-right"></i>
              </span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default AuditModal;
