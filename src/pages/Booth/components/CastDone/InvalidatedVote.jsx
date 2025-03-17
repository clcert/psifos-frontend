function InvalidatedVote(props) {
  return (
    <>
      <p className="subtitle is-3 has-text-black mb-1">
        TU VOTO NO HA SIDO VALIDADO CORRECTAMENTE
      </p>
      <p className="subtitle has-text-black send-text">
        Ha surgido un problema. El voto recibido no es válido. Intenta votar
        nuevamente, y si el problema persiste, por favor contacta a la mesa de
        ayuda haciendo click en el ícono <span className="icon is-medium has-background-info has-text-white"><i className="fa-brands fa-rocketchat"></i></span> que se encuentra en la parte inferior de este sitio.
      </p>
      {/* <ul
        className="mb-5 is-size-4 is-flex is-flex-direction-column is-align-items-flex-start"
        id="help-desk-list"
      >
        <li className="py-1">
          <span className="icon has-text-success">
            <i className="fab fa-whatsapp"></i>
          </span>
          &nbsp;
          <a
            href="https://api.whatsapp.com/send/?phone=56974732599"
            target="_blank"
            rel="noopener noreferrer"
            className="nounderline"
          >
            (+56) 9 7473 2599
          </a>
        </li>
        <li className="py-1">
          <span className="icon has-text-grey">
            <i className="fas fa-envelope"></i>
          </span>
          &nbsp;
          <a
            href="mailto:ayuda.participa@uchile.cl"
            target="_blank"
            rel="noopener noreferrer"
            className="nounderline"
          >
            ayuda.participa@uchile.cl
          </a>
        </li>
        <li className="py-1">
          <span className="icon has-text-info">
            <i className="fab fa-telegram"></i>
          </span>
          &nbsp;
          <a
            href="https://t.me/participauchile"
            target="_blank"
            rel="noopener noreferrer"
            className="nounderline"
          >
            @participaUChile
          </a>
        </li>
        <li className="py-1">
          <span className="icon has-text-info">
            <i className="fab fa-twitter"></i>
          </span>
          &nbsp;
          <a
            href="https://twitter.com/participauchile"
            target="_blank"
            className="nounderline"
            rel="noopener noreferrer"
          >
            @participaUChile
          </a>
        </li>
      </ul> */}

      <a href="https://participa.uchile.cl/">
        <button className="button is-medium my-4" id="back-vote-button">
          <span className="icon is-small">
            <i className="fas fa-2x fa-caret-left"></i>
          </span>
          <span>SALIR</span>
        </button>
      </a>
    </>
  );
}

export default InvalidatedVote;
