import "../static/css/booth.css";

function ElectionCode(props) {
  return (
    <div>
      <footer className="footer">
        <div className="container has-text-centered">
          <p>CÓDIGO DE LA ELECCIÓN</p>
          <div className="columns is-centered">
            <p className="is-family-monospace">{props.uuid}</p>
          </div>
        </div>
      </footer>
      <section className="hero">
        <div className="hero-body bottom-hero"></div>
      </section>
    </div>
  );
}

export default ElectionCode;
