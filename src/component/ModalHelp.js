import { Modal, Button } from "react-bootstrap";
import "../static/css/booth.css";

function ModalHelp(props) {
  return (
    <div className="row justify-content-md-center">
      <Modal
        {...props}
        size="md"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            MESA DE AYUDA
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="has-text-weight-bold">
            ¿Tienes dudas o problemas con tu elección?
          </p>
          <p>
            Puedes utilizar cualquiera de los siguientes canales para que
            podamos ayudarte:
          </p>
          <ul className="pt-4">
            <li className="py-1">
              <span className="icon">
                <i className="fab fa-whatsapp"></i>
              </span>
              <span>
                <a
                  href="https://api.whatsapp.com/send?phone=+56974732599"
                  target="_blank"
                >
                  whatsapp: (+56) 9 7473 2599
                </a>
              </span>
            </li>
            <li className="py-1">
              <span className="icon">
                <i className="fab fa-telegram"></i>
              </span>
              <a href="https://t.me/participaUChile" target="_blank">
                telegram: @participaUChile
              </a>
            </li>
            <li className="py-1">
              <span className="icon">
                <i className="fab fa-twitter"></i>
              </span>
              <span>
                <a
                  href="https://www.twitter.com/participaUChile"
                  target="_blank"
                >
                  twitter: @participaUChile
                </a>
              </span>
            </li>
            <li className="py-1">
              <span className="icon">
                <i className="fas fa-envelope"></i>
              </span>
              <span>
                <a href="mailto:ayuda.participa@uchile.cl" target="_blank">
                  correo: ayuda.participa@uchile.cl
                </a>
              </span>
            </li>
          </ul>
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
    </div >
  );
}

export default ModalHelp;
