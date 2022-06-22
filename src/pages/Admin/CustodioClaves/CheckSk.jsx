import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { backendIP } from "../../../server";
import imageTrustees from "../../../static/svg/trustees2.svg";
import $ from "jquery";
import { BigInt } from "../../../static/cabina/js/jscrypto/bigint";
import { ElGamal } from "../../../static/cabina/js/jscrypto/elgamal";
import { helios_c } from "../../../static/cabina/js/jscrypto/heliosc-trustee";
import { get_eg_params } from "../../../services/crypto";

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

  async function getDataTrustee() {
    const url = "/" + uuid + "/trustee/" + uuidTrustee + "/check-sk";
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    return data;
  }

  useEffect(() => {
    getDataTrustee().then((data) => {
      setCertificates(data);
    });
    get_eg_params(uuid).then((data) => {
      setElGamalParams(data);
    });
  }, []);

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
      setFeedbackMessage("¡Tu clave privada está correcta!");
    } else {
      setFeedbackMessage("Tu clave privada está incorrecta.");
    }
  }

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            adressExit={backendIP + "/" + uuid + "/trustee" + "/logout"}
          />
          <Title
            namePage="Custodio de Claves"
            nameElection={"Etapa 2: Verificación clave privada"}
          />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          <p className="has-text-white">Inserte su clave privada aquí</p>

          <textarea
            className="textarea mb-3"
            placeholder="Clave privada.."
            value={secretKey}
            onChange={(e) => setSecretKey(e.target.value)}
          ></textarea>
          <p className="has-text-white">{feedbackMessage}</p>
          <button id="button-init" className="button is-link mr-5">
            <Link
              style={{ textDecoration: "None", color: "white" }}
              to={"/" + uuid + "/trustee/" + uuidTrustee + "/home"}
            >
              Volver atrás
            </Link>
          </button>
          <button
            id="button-init"
            className="button is-link mr-5"
            onClick={() => check_sk()}
          >
            Verificar
          </button>
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
