function FooterParticipa(props) {
  return (
    <div>
      <footer className="footer">
        <div className="container has-text-centered">
          <p style={{marginBottom: "0"}}>
            {props.message}
          </p>
        </div>
      </footer>

      <section className="hero">
        <div className="hero-body bottom-hero"></div>
      </section>
    </div>
  );
}

export default FooterParticipa;
