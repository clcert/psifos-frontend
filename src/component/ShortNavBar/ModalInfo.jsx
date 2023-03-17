function ModalInfo(props) {
  return (
    <div className={"modal " + (props.show ? "is-active" : "")} id="info-modal">
      <div className="modal-background" onClick={props.onHide}></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="is-3">INFORMACIÓN</h1>
          {props.description != "" && 
            <h1 className="subtitle is-4">Sobre la elección</h1>
          }
          {props.description != "" && 
            <p>{props.description}</p>
          }
          <h1 className="subtitle is-5 mb-2">Sobre Participa UChile</h1>
          <p>
            Participa UChile es un proyecto impulsado por la Prorrectoría de la
            Universidad de Chile y desarrollado por un equipo multidisciplinario
            de profesionales del Laboratorio de Criptografía Aplicada y
            Ciberseguridad (CLCERT) de la Universidad de Chile.<br />
            El sistema está actualmente en desarrollo (beta), por lo que algunas
            opciones pudieran no operar correctamente o el despliegue visual
            mostrar imperfecciones. Nada de esto debiera afectar la privacidad
            de su voto ni la integridad del resultado de la elección.<br />
            Cualquier duda o comentario sobre el sistema, le rogamos
            contactarnos al correo electrónico participa@uchile.cl.
          </p>
        </section>
        <footer className="modal-card-foot">
          <div className="container">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold"
              onClick={props.onHide}
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
