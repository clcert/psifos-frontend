import { useState } from "react";
import { Link } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import imageTrustees from "../../../static/svg/trustees1.svg";

function CustodioHome(props) {
  const [trustee, setTrustee] = useState([]);
  const [election, setElection] = useState([]);

  const disabledButton1 = Boolean(
    !trustee.public_key ||
      (trustee.threshold_step >= 0 && trustee.threshold_step < 3)
      ? false
      : true
  );

  const disabledButton2 = Boolean(
    trustee.public_key && !election.encrypted_tally ? false : true
  );

  const disabledButton3 = Boolean(
    election.encrypted_tally && !trustee.decryption_factors ? false : true
  );

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />
          <Title
            namePage="Custodio de Claves"
            nameElection="Pagina privada de Vocal"
          />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          <h1 className="pb-2 title has-text-white steps-title">PASOS A SEGUIR</h1>
          <div className="is-flex is-align-items-center is-flex-direction-column">
            <div className="is-flex is-flex-direction-column">
              <button
                className={
                  "button is-medium step-button my-2 " +
                  (disabledButton1 ? "inactive-button" : "")
                }
                disabled={disabledButton1}
              >
                <Link
                  style={{ textDecoration: "None", color: "white" }}
                  to="/admin/10/custodio/10/keygenerator"
                >
                  <span>PASO 1:&nbsp;</span>
                  <span>Generar llaves.</span>
                </Link>
              </button>

              <button
                className={
                  "button is-medium step-button my-2 " +
                  (disabledButton2 ? "inactive-button" : "")
                }
                disabled={disabledButton2}
              >
                <span>PASO 2:&nbsp;</span>
                <span>Verifica tu Clave Privada</span>
              </button>

              <button
                className={
                  "button is-medium step-button my-2 " +
                  (disabledButton3 ? "inactive-button" : "")
                }
                disabled={disabledButton3}
              >
                <span>PASO 3:&nbsp;</span>
                <span>Desencriptar resultado final</span>
              </button>
            </div>
            {!election.encrypted_tally && (
              <p className="has-text-white pt-5">
                * Una vez realizado el precómputo, debes volver aquí para
                entregar tu clave privada y desencriptar el resultado final *
              </p>
            )}

            {trustee.decryption_factors ? (
              <p className="has-text-white pt-5">
                Ya has completado exitosamente todos los pasos como vocal de la
                elección. Muchas gracias por tu participación.
              </p>
            ) : (
              <p className="has-text-white">
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
