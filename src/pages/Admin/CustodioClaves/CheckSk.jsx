import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ElGamal } from "../../../static/booth/js/jscrypto/elgamal";
import { helios_c } from "../../../static/booth/js/jscrypto/heliosc-trustee";
import { getCheckSk, getEgParams } from "../../../services/crypto";
import { backendOpIP } from "../../../server";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import imageTrustees from "../../../static/svg/trustees2.svg";
import DropFile from "./components/DropFile";

function CheckSk(props) {
  /** @state {string} secret key for check */
  const [secretKey, setSecretKey] = useState("");

  /** @state {string} trustee uuid */
  const { uuid, uuidTrustee } = useParams();

  /** @state {string} message with check result */
  const [feedbackMessage, setFeedbackMessage] = useState("");

  /** @state {json} el gamal params */
  const [ElGamalParams, setElGamalParams] = useState({});

  /** @state {string} trustee certificates */
  const [certificates, setCertificates] = useState({});

  const [keyVerificated, setKeyVerificated] = useState(false);

  useEffect(() => {
    getCheckSk(uuid, uuidTrustee).then((data) => {
      setCertificates(data);
    });
    getEgParams(uuid).then((data) => {
      setElGamalParams(JSON.parse(data));
    });
  }, [uuid, uuidTrustee]);

  function check_sk() {
    let params = ElGamal.Params.fromJSONObject(ElGamalParams);
    let trustee_aux = helios_c.trustee_create(params, secretKey);
    let key_ok_p = false;
    if (!trustee_aux.check_certificate(certificates)) {
      console.log("Not the right key!");
    } else {
      console.log("The right key!");
      key_ok_p = true;
    }
    if (key_ok_p) {
      setKeyVerificated(true);
      setFeedbackMessage("Clave Verificada Exitosamente");
    } else {
      setFeedbackMessage("Tu clave privada está incorrecta.");
    }
  }

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            linkExit={`${backendOpIP}/${uuid}/trustee/logout`}
            linkInit={"/" + uuid + "/trustee/" + uuidTrustee + "/home"}
          />
          <TitlePsifos
            namePage="Custodio de Claves"
            nameElection={"Etapa 2: Verificación clave privada"}
          />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          <h4 className="has-text-white">Inserte su clave privada aquí</h4>
          <DropFile setText={setSecretKey} />
          <input
            type="text"
            disabled
            className="input mb-3 mt-4"
            placeholder="Clave privada.."
            value={secretKey}
          />
          <p className="has-text-white">{feedbackMessage}</p>
          <div className="d-flex justify-content-center flex-sm-row flex-column-reverse mt-4">
            <button id="button-init" className="button mx-sm-2 mt-2">
              <Link
                style={{ textDecoration: "None", color: "black" }}
                to={"/psifos/" + uuid + "/trustee/" + uuidTrustee + "/home"}
              >
                Volver atrás
              </Link>
            </button>
            {!keyVerificated && (
              <button
                id="button-init"
                className="button mt-2 mx-sm-2"
                onClick={() => check_sk()}
              >
                Verificar
              </button>
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

export default CheckSk;
