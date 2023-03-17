import "../../static/css/animations.css";

function ModalHelp(props) {
  return (
    <div className={"modal " + (props.show ? "is-active" : "")} id="help-modal">
      <div className="modal-background" onClick={props.onHide}></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">MESA DE AYUDA</h1>
          <p className="mb-2">
            <span className="has-text-weight-bold">¿Tienes dudas o problemas con tu elección?</span><br/>
            Puedes utilizar cualquiera de los siguientes canales para que
            podamos ayudarte:
          </p>
          <ul className="pt-1">
            <li className="py-1">
              <span className="icon">
                <i className="fab fa-whatsapp"></i>
              </span>
              whatsapp:&nbsp; 
              <span>
                <a
                  href="https://api.whatsapp.com/send?phone=+56974732599"
                  rel="noreferrer"
                  target="_blank"
                >
                  (+56) 9 7473 2599
                </a>
              </span>
            </li>
            <li className="py-1">
              <span className="icon">
                <i className="fab fa-telegram"></i>
              </span>
              telegram:&nbsp;
              <a
                href="https://t.me/participaUChile"
                rel="noreferrer"
                target="_blank"
              >
                @participaUChile
              </a>
            </li>
            <li className="py-1">
              <span className="icon">
                <i className="fab fa-twitter"></i>
              </span>
              twitter:&nbsp;
              <span>
                <a
                  href="https://www.twitter.com/participaUChile"
                  rel="noreferrer"
                  target="_blank"
                >
                  @participaUChile
                </a>
              </span>
            </li>
            <li className="py-1">
              <span className="icon">
                <i className="fas fa-envelope"></i>
              </span>
              correo:&nbsp;
              <span>
                <a
                  href="mailto:ayuda.participa@uchile.cl"
                  rel="noreferrer"
                  target="_blank"
                >
                  ayuda.participa@uchile.cl
                </a>
              </span>
            </li>
          </ul>
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

export default ModalHelp;
