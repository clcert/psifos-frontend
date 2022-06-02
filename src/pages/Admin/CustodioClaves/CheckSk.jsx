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
import { b64_sha256 } from "../../../static/cabina/js/jscrypto/sha2";
import { getTrustee } from "../../../services/trustee";

function CheckSk(props) {
  const [secretKey, setSecretKey] = useState("");
  const [trustee, setTrustee] = useState("");
  const { uuid, uuidTrustee } = useParams();
  const [PkHash, setPkHash] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState("");

  async function sendSecretKey() {
    const url = "/" + uuid + "/trustee/" + uuidTrustee + "/check-sk";
    const resp = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        secret_key: secretKey,
      }),
    });
    try {
      const jsonResponse = await resp.json();
      if (resp.status === 200) {
      }
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getTrustee(uuidTrustee).then((trustee) => {
      setTrustee(trustee.jsonResponse.trustee);
      setPkHash(trustee.jsonResponse.trustee.public_key_hash);
    });
  }, []);

  function check_sk() {
    try {
      var secret_key = ElGamal.SecretKey.fromJSONObject(
        $.secureEvalJSON(secretKey)
      );
      console.log(secret_key);

      var pk_hash = b64_sha256($.toJSON(secret_key.pk));
      console.log(pk_hash);
      var key_ok_p = pk_hash == PkHash;
    } catch (e) {
      console.log(e);
      var key_ok_p = false;
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
            nameElection={"Paso 2: Verificación clave privada"}
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
