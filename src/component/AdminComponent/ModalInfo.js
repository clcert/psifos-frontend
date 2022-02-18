import $ from "jquery";

function ModalInfo(props) {
  return (
    <div className="modal" id="info-modal">
      <div
        className="modal-background"
        onClick={() => {
          $("#info-modal").removeClass("is-active");
        }}
      ></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">INFORMACIÓN</h1>
          <p>
            Participa UChile es un proyecto impulsado por la Prorrectoría de la
            Universidad de Chile y desarrollado por un equipo multidisciplinario
            de profesionales del Laboratorio de Criptografía Aplicada y
            Ciberseguridad (CLCERT) de la Universidad de Chile.
          </p>
          <p>
            El sistema está actualmente en desarrollo (beta), por lo que algunas
            opciones pudieran no operar correctamente o el despliegue visual
            mostrar imperfecciones. Nada de esto debiera afectar la privacidad
            de su voto ni la integridad del resultado de la elección.
          </p>
          <p>
            Cualquier duda o comentario sobre el sistema, le rogamos
            contactarnos al correo electrónico participa@uchile.cl.
          </p>
        </section>
        <footer className="modal-card-foot">
          <div className="container">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold"
              onClick={() => {
                $("#info-modal").removeClass("is-active");
              }}
            >
              <span>VOLVER ATRÁS</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ModalInfo;
