import { useEffect, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { backendIP } from "../../../server";
import imageTrustees from "../../../static/svg/trustees1.svg";
import NoAuth from "../../Cabina/NoAuth";

function CustodioHome(props) {
  const [trustee, setTrustee] = useState([]);
  const [election, setElection] = useState([]);
  const [load, setLoad] = useState(false);
  const [auth, setAuth] = useState(false);
  const [noAuthMessage, setNoAuthMessage] = useState("");

  /** @state {bool}  */
  const [searchParams, setSearchParams] = useSearchParams();

  const { uuid, uuidTrustee } = useParams();

  const disabledButton1 = Boolean(
    !trustee.public_key ||
      (trustee.current_step >= 0 && trustee.current_step < 3)
      ? false
      : true
  );

  const disabledButton2 = Boolean(
    trustee.public_key && !election.encrypted_tally ? false : true
  );

  const disabledButton3 = Boolean(
    election.encrypted_tally && !trustee.decryption_factors ? false : true
  );

  async function getTrustee() {
    const url = backendIP + "/" + uuid + "/trustee/" + uuidTrustee + "/home";
    const resp = await fetch(url, {
      method: "GET",
      credentials: "include",
    });
    try {
      const jsonResponse = await resp.json();
      setLoad(true);
      if (resp.status === 200) {
        setAuth(true);
        setTrustee(jsonResponse);
      } else if (resp.status === 401) {
        setNoAuthMessage(
          "La elección no existe o no estas habilitado para generar llaves en ella"
        );
      }
    } catch (err) {
      setLoad(true);
      setNoAuthMessage(
        "La elección no existe o no estas habilitado para generar llaves en ella"
      );
    }
  }

  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      window.location.href = backendIP + "/" + uuid + "/trustee/login";
    }
    getTrustee();
  }, []);

  if (!load) {
    return <>LOAD</>;
  } else if (!auth) {
    return (
      <NoAuth
        message={noAuthMessage}
        adressLogout={backendIP + "/" + uuid + "/trustee" + "/logout"}
      ></NoAuth>
    );
  } else if (load) {
    return (
      <div id="content-trustees">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar
              adressExit={backendIP + "/" + uuid + "/trustee" + "/logout"}
            />
            <Title
              namePage="Custodio de Claves"
              nameElection={"Pagina privada de Vocal"}
            />
          </div>
        </section>

        <section className="section" id="medium-section">
          <div className="container has-text-centered is-max-desktop">
            <h1 className="pb-2 title has-text-white steps-title">
              PASOS A SEGUIR
            </h1>
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
                    to={
                      "/" + uuid + "/trustee/" + uuidTrustee + "/keygenerator"
                    }
                  >
                    <span>ETAPA 1:&nbsp;</span>
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
                  <Link
                    style={{ textDecoration: "None", color: "white" }}
                    to={"/" + uuid + "/trustee/" + uuidTrustee + "/check-sk"}
                  >
                    <span>ETAPA 2:&nbsp;</span>
                    <span>Verifica tu Clave Privada</span>
                  </Link>
                </button>

                <button
                  className={
                    "button is-medium step-button my-2 " +
                    (disabledButton3 ? "inactive-button" : "")
                  }
                  disabled={disabledButton3}
                >
                  <span>ETAPA 3:&nbsp;</span>
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
                  Ya has completado exitosamente todos los pasos como vocal de
                  la elección. Muchas gracias por tu participación.
                </p>
              ) : (
                <p className="has-text-white">
                  Guarda el correo electrónico con el enlace de tu página
                  privada de vocal, para volver más adelante.
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
}

export default CustodioHome;
