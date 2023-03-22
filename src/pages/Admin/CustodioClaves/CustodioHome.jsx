import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import LoadPage from "../../../component/Loading/LoadPage";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { backendOpIP } from "../../../server";
import { getTrusteeHome } from "../../../services/trustee";
import imageTrustees from "../../../static/svg/trustees1.svg";
import NoAuth from "../../Booth/NoAuth";
import StepButton from "./components/StepButton";

function CustodioHome(props) {
  const [trustee, setTrustee] = useState([]);
  const [election, setElection] = useState([]);
  const [load, setLoad] = useState(false);
  const [auth, setAuth] = useState(false);
  const [noAuthMessage, setNoAuthMessage] = useState("");

  /** @state {bool}  */
  const [searchParams] = useSearchParams();

  const { uuid, uuidTrustee } = useParams();

  const disabledButton1 = Boolean(
    !trustee.public_key ||
      (trustee.current_step >= 0 && trustee.current_step < 3)
      ? false
      : true
  );

  const disabledButton2 = Boolean(trustee.public_key ? false : true);

  const disabledButton3 = Boolean(
    trustee.current_step === 4 &&
      election.encrypted_tally !== null &&
      trustee.decryptions === null
      ? false
      : true
  );

  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      window.location.href = backendOpIP + "/" + uuid + "/trustee/login";
    }
    getTrusteeHome(uuid, uuidTrustee).then((data) => {
      try {
        const { resp, jsonResponse } = data;

        setLoad(true);
        if (resp.status === 200) {
          setAuth(true);
          setTrustee(jsonResponse.trustee);
          setElection(jsonResponse.election);
        } else {
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
  }, [searchParams, uuid, uuidTrustee]);

  if (!load) {
    return <LoadPage />;
  }

  if (!auth) {
    return (
      <NoAuth
        title={"Custodio de Claves"}
        message={noAuthMessage}
        adressLogout={`${backendOpIP}/${uuid}/trustee/logout`}
      ></NoAuth>
    );
  } else {
    return (
      <div id="content-trustees">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar
              linkExit={`${backendOpIP}/${uuid}/trustee/logout`}
              linkInit={"/" + uuid + "/trustee/" + uuidTrustee + "/home"}
            />
            <TitlePsifos
              namePage="Portal de Custodio de Clave"
              nameElection={election.name}
            />
          </div>
        </section>

        <section className="section" id="medium-section">
          <div className="container has-text-centered is-max-desktop">
            <div>
              {load ? (
                <>
                  <div className="d-inline-flex justify-content-center flex-column">
                    {!disabledButton1 && (
                      <StepButton
                        text="Iniciar Generación de Claves"
                        linkTo={
                          "/psifos/" +
                          uuid +
                          "/trustee/" +
                          uuidTrustee +
                          "/keygenerator"
                        }
                      />
                    )}
                    {!disabledButton2 && (
                      <StepButton
                        text="Verificar Clave Privada"
                        linkTo={
                          "/psifos/" +
                          uuid +
                          "/trustee/" +
                          uuidTrustee +
                          "/check-sk"
                        }
                      />
                    )}
                    {!disabledButton3 && (
                      <StepButton
                        text="Enviar Desencriptación Parcial"
                        linkTo={
                          "/psifos/" +
                          uuid +
                          "/trustee/" +
                          uuidTrustee +
                          "/decrypt-and-prove"
                        }
                      />
                    )}
                  </div>
                  {!election.encrypted_tally && (
                    <p className="has-text-white pt-5 px-5 is-size-5">
                      Cuando termine la elección, debes volver a este sitio para que puedas 
                      enviar tu desencriptación parcial
                    </p>
                  )}
                </>
              ) : (
                <div className="spinner-animation-white"></div>
              )}
            </div>
          </div>
        </section>

        <div>
          <ImageFooter imagePath={imageTrustees} />
          <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
        </div>
      </div>
    );
  }
}

export default CustodioHome;
