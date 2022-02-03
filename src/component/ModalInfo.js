import { Modal, Button } from "react-bootstrap";
function ModalInfo(props) {
  return (
    <>
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            <h1>INFORMACIÓN</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
        </Modal.Body>
        <Modal.Footer>
          <div className="container">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold"
              onClick={props.onHide}
            >
              <span>VOLVER ATRÁS</span>
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ModalInfo;
