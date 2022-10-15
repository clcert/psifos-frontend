function InvalidatedVote(props) {
  return (
    <>
      <p className="subtitle is-3 has-text-black mb-1">
        SU VOTO NO HA SIDO VALIDAD CORRECTAMENTE
      </p>
      <p className="subtitle has-text-black send-text">
        Esta papeleta esta objetada, por lo que no será incorporada al conteo
        final.
      </p>

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
