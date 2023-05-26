import encryptingGIF from "../../../../static/img/encrypting.gif";

function ModalDecrypt(props) {
  return (
    <div className={"modal " + (props.show ? "is-active" : "")} id="help-modal">
      <div className="modal-background"></div>
      <div className="modal-card">
        <section className="modal-card-body single-card has-text-centered">
          <p className="has-text-weight-bold is-size-5">
            REALIZANDO DESENCRIPTACIONES <br />
            POR FAVOR ESPERA UN MOMENTO
          </p>
          <img alt="encrypr" className="mt-2" src={encryptingGIF} />
          <p className="subtitle mt-4">
            Se esta realizando el proceso de desencriptación
          </p>
          {/* <PercentageBar percentage={percentage} booth={props.booth} /> */}
        </section>
      </div>
    </div>
  );
}

export default ModalDecrypt;
