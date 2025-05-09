const messageError = "Pagina no encontrada. Por favor, intente nuevamente más tarde.";
const NotFound = () => (

    <div id="content" className="parallax-01">
    <section className="parallax hero is-medium">
      <section className="section" id="auth-section">
        <div className="has-text-centered title is-size-4-mobile">{messageError}</div>
      </section>
    </section>

    <div id="bottom"></div>
  </div>
);

export default NotFound;