function ModalInfo(props) {
  return (
    <div className={"main-modal modal " + (props.show ? "is-active" : "")} id="info-modal">
      <div className="modal-background" onClick={props.onHide}></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="is-3 modal-title">INFORMACIÓN</h1>
          <div className="modal-card-text">
            Participa UChile es un proyecto impulsado por la Prorrectoría de la
            Universidad de Chile y desarrollado por un equipo multidisciplinario
            de profesionales del Laboratorio de Criptografía Aplicada y
            Ciberseguridad (CLCERT) de la misma institución.<br /><br />

            El sistema de votación utiliza métodos criptográficos que 
            permiten asegurar el secreto del voto y la integridad de los resultados.
            Además, al final de la elección se habilita un proceso que permite 
            verificar matemáticamente la correctitud del resultado publicado.<br/><br/>

            Si tiene alguna pregunta o comentario sobre el sistema, por favor,
            no dude en contactarnos a través de correo electrónico
            participa@uchile.cl.
          </div>
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
