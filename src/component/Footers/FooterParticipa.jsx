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

    </div>
  );
}

export default FooterParticipa;
