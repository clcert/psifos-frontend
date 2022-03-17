import { useState } from "react";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import imageTrustees from "../../../static/svg/trustees1.svg"

function CustodioHome(props) {
  const [trustee, setTrustee] = useState([]);
  const [election, setElection] = useState([]);
  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />
          <Title namePage="Custodio de Claves" nameElection="Pagina privada de Vocal" />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          <h1 class="pb-2 title has-text-white steps-title">PASOS A SEGUIR</h1>
          <div class="is-flex is-align-items-center is-flex-direction-column">
            <div class="is-flex is-flex-direction-column">
              <button
                class="button is-medium step-button my-2"
                disabled={
                  !trustee.public_key ||
                  (trustee.threshold_step >= 0 && trustee.threshold_step < 3)
                }
              >
                {" "}
                <span>PASO 1:&nbsp;</span>
                <span>Generar llaves.</span>
              </button>

              <button
                class="button is-medium step-button my-2"
                disabled={trustee.public_key && !election.encrypted_tally}
              >
                <span>PASO 2:&nbsp;</span>
                <span>Verifica tu Clave Privada</span>
              </button>

              <button
                class="button is-medium step-button my-2"
                disabled={
                  election.encrypted_tally && !trustee.decryption_factors
                }
              >
                <span>PASO 3:&nbsp;</span>
                <span>Desencriptar resultado final</span>
              </button>
            </div>
            {!election.encrypted_tally && (
              <p class="has-text-white pt-5">
                * Una vez realizado el precómputo, debes volver aquí para
                entregar tu clave privada y desencriptar el resultado final *
              </p>
            )}

            {trustee.decryption_factors ? (
              <p class="has-text-white pt-5">
                Ya has completado exitosamente todos los pasos como vocal de la
                elección. Muchas gracias por tu participación.
              </p>
            ) : (
              <p class="has-text-white pt-5">
                Guarda el correo electrónico con el enlace de tu página privada
                de vocal, para volver más adelante.
              </p>
            )}
          </div>
        </div>
      </section>
      <div>
        <ImageFooter imagePath={imageTrustees} />
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
      </div>
    </div>
  );
}

export default CustodioHome;
