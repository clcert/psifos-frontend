import encryptingGif from "../../../static/cabina/encrypting.gif";
import encryptingImage from "../../../static/cabina/svg/encrypting-img.svg";

function EncryptingCharging(props) {
  return (
    <div id="encrypting_div" class="panel mb-0">
      <section class="section pb-0" id="encrypting-section">
        <div id="encrypting-top-wrapper">
          <img src={encryptingGif} />
          <p class="pt-6 has-text-centered">
            <span class="has-text-weight-bold is-size-5">
              ENCRIPTANDO TU VOTO,{" "}
            </span>
            <span class="is-size-5">POR FAVOR ESPERA UN MOMENTO</span>
          </p>
        </div>
        <figure class="image encrypting-img-wrapper is-hidden-mobile">
          <img id="encrypting-final-img" src={encryptingImage} />
        </figure>
      </section>
    </div>
  );
}

export default EncryptingCharging;
