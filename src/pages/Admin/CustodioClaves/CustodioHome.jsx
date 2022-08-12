import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { backendIP } from "../../../server";
import { getTrusteeHome } from "../../../services/trustee";
import imageTrustees from "../../../static/svg/trustees1.svg";
import NoAuth from "../../Cabina/NoAuth";
import StepButton from "./components/StepButton";

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
    trustee.public_key  ? false : true
  );

  const disabledButton3 = Boolean(
    trustee.current_step === 4 &&
      election.encrypted_tally !== null &&
      trustee.decryptions === null
      ? false
      : true
  );


  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      window.location.href = backendIP + "/" + uuid + "/trustee/login";
    }
    getTrusteeHome(uuid, uuidTrustee).then((data) => {
      try {
        const { resp, jsonResponse } = data;

        setLoad(true);
        if (resp.status === 200) {
          setAuth(true);
          setTrustee(jsonResponse.trustee);
          setElection(jsonResponse.election);
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
    });
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
              addressExit={backendIP + "/" + uuid + "/trustee" + "/logout"}
              addressInit={"/" + uuid + "/trustee/" + uuidTrustee + "/home"}
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
                <StepButton
                  step={1}
                  disabled={disabledButton1}
                  text="Generar llaves."
                  linkTo={
                    "/" + uuid + "/trustee/" + uuidTrustee + "/keygenerator"
                  }
                />
                <StepButton
                  step={2}
                  disabled={disabledButton2}
                  text="Verifica tu Clave Privada"
                  linkTo={"/" + uuid + "/trustee/" + uuidTrustee + "/check-sk"}
                />
                <StepButton
                  step={3}
                  disabled={disabledButton3}
                  text="Desencriptar resultado final"
                  linkTo={
                    "/" +
                    uuid +
                    "/trustee/" +
                    uuidTrustee +
                    "/decrypt-and-prove"
                  }
                />
              </div>
              {!election.encrypted_tally && (
                <p className="has-text-white pt-5">
                  * Una vez realizado el precómputo, debes volver aquí para
                  entregar tu clave privada y desencriptar el resultado final *
                </p>
              )}

              {trustee.decryptions ? (
                <p className="has-text-white">
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
