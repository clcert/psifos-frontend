function DescriptionModal(props) {
  return (
    <div className={"modal " + (props.show ? "is-active" : "")} id="help-modal">
      <div className="modal-background" onClick={props.onHide}></div>
      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">{props.election.name}</h1>
          <p className="subtitle">
            Participa UChile
          </p>
          <p>{props.election.description}</p>
          <p>Si tienes alguna duda, te invitamos a contactar a la mesa de ayuda:</p>
          <div className="py-1">
            <span className="icon">
              <i className="fab fa-whatsapp"></i>
            </span>
            &nbsp; 
            <span>
              <a
                href="https://api.whatsapp.com/send?phone=+56974732599"
                rel="noreferrer"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                (+56) 9 7473 2599
              </a>
            </span>
          </div>
          <div className="py-1">
            <span className="icon">
              <i className="fab fa-telegram"></i>
            </span>
            &nbsp;
            <a
              href="https://t.me/participaUChile"
              rel="noreferrer"
              target="_blank"
              style={{ textDecoration: "none" }}
            >
              @participaUChile
            </a>
          </div>
          <div className="py-1">
            <span className="icon">
              <i className="fab fa-twitter"></i>
            </span>
            &nbsp;
            <span>
              <a
                href="https://www.twitter.com/participaUChile"
                rel="noreferrer"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                @participaUChile
              </a>
            </span>
          </div>
          <div className="py-1">
            <span className="icon">
              <i className="fas fa-envelope"></i>
            </span>
            &nbsp;
            <span>
              <a
                href="mailto:ayuda.participa@uchile.cl"
                rel="noreferrer"
                target="_blank"
                style={{ textDecoration: "none" }}
              >
                ayuda.participa@uchile.cl
              </a>
            </span>
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="container has-text-centered">
            <button
              onClick={props.onHide}
              className="button previous-button has-text-white has-text-weight-bold is-large is-responsive"
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
