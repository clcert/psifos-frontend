import $ from "jquery";
import { Transition } from "react-transition-group";
import "../../static/css/animations.css";

function ModalHelp(props) {
  return (
    <Transition
      transitionName="example"
      transitionEnterTimeout={500}
      transitionLeaveTimeout={300}
    >
      <div className="modal" id="help-modal">
        <div
          className="modal-background"
          onClick={() => {
            $("#help-modal").removeClass("is-active");
          }}
        ></div>
        <div className="modal-card">
          <section className="modal-card-body">
            <h1 className="title">MESA DE AYUDA</h1>
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
          </section>
          <footer className="modal-card-foot">
            <div className="container">
              <button
                className="button review-buttons previous-button has-text-white has-text-weight-bold"
                onClick={() => {
                  $("#help-modal").removeClass("is-active");
                }}
              >
                <span>VOLVER ATRÁS</span>
              </button>
            </div>
          </footer>
        </div>
      </div>
    </Transition>
  );
}

export default ModalHelp;
