function ElectionCode(props) {
  return (
    <div>
      <footer className="footer">
        <div
          className="container has-text-centered"
          style={{ marginTop: "0.5rem" }}
        >
          <div className="columns is-centered" style={{ marginBottom: "0" }}>
            <p>CÓDIGO DE LA ELECCIÓN</p>
          </div>
          <div className="columns is-centered">
            <p className="is-family-monospace" style={{ marginBottom: "0" }}>
              {props.uuid}
            </p>
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
