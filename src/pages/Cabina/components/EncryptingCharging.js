import encryptingGif from "../../../static/cabina/encrypting.gif";
import encryptingImage from "../../../static/cabina/svg/encrypting-img.svg";

function EncryptingCharging(props) {
  return (
    <div id="encrypting_div" className="panel mb-0">
      <section className="section pb-0" id="encrypting-section">
        <div id="encrypting-top-wrapper">
          <img src={encryptingGif} />
          <p className="pt-6 has-text-centered">
            <span className="has-text-weight-bold is-size-5">
              ENCRIPTANDO TU VOTO,{" "}
            </span>
            <span className="is-size-5">POR FAVOR ESPERA UN MOMENTO</span>
          </p>
        </div>
        <figure className="image encrypting-img-wrapper is-hidden-mobile">
          <img id="encrypting-final-img" src={encryptingImage} />
        </figure>
      </section>
    </div>
  );
}

export default EncryptingCharging;
