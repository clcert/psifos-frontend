function InvalidatedVote(props) {
  return (
    <>
      <p className="subtitle is-3 has-text-black mb-1">
        SU VOTO NO HA SIDO VALIDADO CORRECTAMENTE
      </p>
      <p className="subtitle has-text-black send-text">
        Ha surgido un problema. El voto recibido no es válido. Intente votar
        nuevamente, y si el problema persiste, por favor contactar a la mesa de
        ayuda:
      </p>
      <ul
        class="mb-5 is-size-4 is-flex is-flex-direction-column is-align-items-center"
        id="help-desk-list"
      >
        <li class="py-1">
          <span class="icon has-text-success">
            <i class="fab fa-whatsapp"></i>
          </span>
          <span>(+56) 9 7473 2599</span>
        </li>
        <li class="py-1">
          <span class="icon has-text-grey">
            <i class="fas fa-envelope"></i>
          </span>
          <span>ayuda.participa@uchile.cl</span>
        </li>
        <li class="py-1">
          <span class="icon has-text-info">
            <i class="fab fa-telegram"></i>
          </span>
          <span>@participaUChile</span>
        </li>
        <li class="py-1">
          <span class="icon has-text-info">
            <i class="fab fa-twitter"></i>
          </span>
          <span>@participaUChile</span>
        </li>
      </ul>

      <a href="https://participa.uchile.cl/">
        <button className="button is-medium my-4" id="back-vote-button">
          <span className="icon is-small">
            <i className="fas fa-2x fa-caret-left"></i>
          </span>
          <span>IR A PÁGINA PRINCIPAL</span>
        </button>
      </a>
    </>
  );
}

export default InvalidatedVote;
