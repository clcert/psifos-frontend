function DescriptionModal(props) {
  return (
    <div className={"modal " + (props.show ? "is-active" : "")} id="help-modal">
      <div className="modal-background" onClick={props.onHide}></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">{props.election.name}</h1>
          <p className="subtitle">
            Te damos la bienvenida a Participa UChile
          </p>
          <p>{props.election.description}</p>
          <p>Si tienes alguna duda, te invitamos a contactar a nuestra mesa de ayuda a través de cualquiera de los siguientes canales:</p>
          <div className="py-1">
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
          </div>
          <div className="py-1">
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
          </div>
          <div className="py-1">
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
          </div>
          <div className="py-1">
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
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="container">
            <button
              onClick={props.onHide}
              className="button review-buttons previous-button has-text-white has-text-weight-bold is-pulled-right"
            >
              <span>COMENZAR</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default DescriptionModal;
