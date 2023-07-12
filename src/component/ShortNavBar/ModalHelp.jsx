import "../../static/css/animations.css";

function InfoChannel({
  icon, name, contact, href
}) {
  return(
    <div className="py-1">
      <span className="icon">
        <i className={icon}/>
      </span>
      {name}:&nbsp;
      <span>
        <a
          href={href}
          rel="noreferrer"
          target="_blank"
        >
          {contact}
        </a>
      </span>
    </div>
  )
}

function InfoChannels() {
  return (
    <div className="ml-2 mr-2">
      <InfoChannel
        icon="fab fa-whatsapp"
        name="whatsapp"
        contact="(+56) 9 7473 2599"
        href=" https://web.whatsapp.com/send/?phone=+56974732599"
      />
      <InfoChannel
        icon="fab fa-telegram"
        name="telegram"
        contact="@participaUChile"
        href="https://t.me/participaUChile"
      />
      <InfoChannel
        icon="fab fa-twitter"
        name="twitter"
        contact="@participaUChile"
        href="https://www.twitter.com/participaUChile"
      />
      <InfoChannel
        icon="fas fa-envelope"
        name="correo"
        contact="ayuda.participa@uchile.cl"
        href="mailto:ayuda.participa@uchile.cl"
      />
    </div>
  )
}

function ModalHelp(props) {
  return (
    <div className={"main-modal modal " + (props.show ? "is-active" : "")} id="help-modal">
      <div className="modal-background" onClick={props.onHide}></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="modal-title">MESA DE AYUDA</h1>

          <p className="mb-2 ml-2 mr-2">
            <span className="has-text-weight-bold">¿Tiene dudas o problemas con su elección?</span><br/>
            Puede utilizar cualquiera de los siguientes canales para contactarnos:
          </p>
          <InfoChannels />
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
