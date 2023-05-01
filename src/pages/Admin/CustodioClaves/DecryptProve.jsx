import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BigInt } from "../../../static/booth/js/jscrypto/bigint";
import { ElGamal } from "../../../static/booth/js/jscrypto/elgamal";
import { helios_c } from "../../../static/booth/js/jscrypto/heliosc-trustee";
import { backendOpIP } from "../../../server";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import imageTrustees from "../../../static/svg/trustees2.svg";
import Tally from "../../../static/booth/js/jscrypto/tally";
import { getEgParams } from "../../../services/crypto";
import DropFile from "./components/DropFile";

function DecryptProve() {
  const [actualStep, setActualStep] = useState(0);
  const [params, setParams] = useState({});
  const [secretKey, setSecretKey] = useState("");
  const [certificates, setCertificates] = useState({});
  const [points, setPoints] = useState({});
  const [tally, setTally] = useState({});
  const [electionPk, setElectionPk] = useState("");
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Cargando información..."
  );

  const { shortName, uuidTrustee } = useParams();

  const getDescrypt = useCallback(async () => {
    const url =
      backendOpIP +
      "/" +
      shortName +
      "/trustee/" +
      uuidTrustee +
      "/decrypt-and-prove";
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  }, [shortName, uuidTrustee]);

  async function sendDescrypt(descriptions) {
    setFeedbackMessage("Enviando información...");
    const url =
      backendOpIP +
      "/" +
      shortName +
      "/trustee/" +
      uuidTrustee +
      "/decrypt-and-prove";
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: descriptions,
    });
    if (response.status === 200) {
      setFeedbackMessage("Desencriptación Parcial enviada exitosamente ✓");
      setActualStep(2);
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      setFeedbackMessage("Error al enviar información, intente nuevamente");
      setActualStep(0);
    }
  }

  const getSecretKey = useCallback(
    (sk) => {
      helios_c.trustee = helios_c.trustee_create(params, sk);
      helios_c.params = params;
      helios_c.certificates = certificates;
      helios_c.points = points;
      // TODO: check key
      var sk = helios_c.ui_share_get_direct();
      return new ElGamal.SecretKey(sk.x, sk.public_key);
    },
    [certificates, params, points]
  );

  const doTally = useCallback(
    (sk) => {
      if (!sk) {
        setFeedbackMessage("Formato de archivo incorrecto");
        return;
      }
      var secret_key = getSecretKey(sk);

      // ENCRYPTED TALLY :
      let tally_factors_and_proof = tally.map(function (q_tally) {
        return q_tally.doDecrypt(electionPk, secret_key);
      });

      let final_json = {
        decryptions: tally_factors_and_proof,
      };
      const descriptions = JSON.stringify(final_json);
      setFeedbackMessage("Listo para enviar el desencriptado parcial");
      sendDescrypt(descriptions);
    },
    [electionPk, getSecretKey, tally]
  );

  useEffect(() => {
    let params_aux, certificates_aux, points_aux, election_aux, trustee_aux;

    getEgParams(shortName).then((eg_params) => {
      getDescrypt().then((data) => {
        params_aux = JSON.parse(eg_params);
        certificates_aux = JSON.parse(data.certificates);
        points_aux = JSON.parse(data.points);
        election_aux = data.election;
        trustee_aux = data.trustee;

        setParams(params_aux);
        setCertificates(certificates_aux);
        setPoints(points_aux);

        BigInt.setup(function () {
          let PARAMS = ElGamal.Params.fromJSONObject(params_aux);
          PARAMS.trustee_id = trustee_aux.trustee_id;
          setParams(PARAMS);
          let ELECTION_JSON = election_aux;
          let ELECTION_PK = ElGamal.PublicKey.fromJSONObject(
            ELECTION_JSON["public_key"]
          );
          setElectionPk(ELECTION_PK);
          let TALLY = Tally.createAllTally(
            JSON.parse(ELECTION_JSON.encrypted_tally),
            ELECTION_PK
          );
          setTally(TALLY);
        });
        setFeedbackMessage(
          "Esperando clave para generar desencriptado parcial"
        );
      });
    });
  }, [getDescrypt]);

  const decrypt = (sk) => {
    try {
      setSecretKey(sk);
      setFeedbackMessage("Generando desencriptado parcial...");
      setActualStep(1);
      doTally(sk);
    } catch {
      setFeedbackMessage("Clave incorrecta");
    }
  };

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            linkExit={`${backendOpIP}/${shortName}/trustee/logout`}
            linkInit={`/${shortName}/trustee/${uuidTrustee}/home`}
          />
          <TitlePsifos
            namePage="Custodio de Claves"
            nameElection={"Etapa 3: Verificación clave privada"}
          />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered has-text-white is-max-desktop">
          <p>
            Se ha calculado el recuento cifrado de la elección.
            <br />
            Ahora es el momento de calcular y enviar su desencriptado parcial.
          </p>

          <div id="sk_section">
            <h3>Inserte su clave privada aquí</h3>
            <DropFile setText={decrypt} />
            <input
              value={secretKey}
              className="input mb-2 mt-4 has-text-centered is-family-monospace"
              placeholder="Clave privada..."
              disabled
            />
            <p className="has-text-white pt-2">
              {feedbackMessage}
              <i
                className={
                  "ml-2 " + (actualStep === 1 && "fa-solid fa-spinner fa-spin")
                }
              ></i>
            </p>

            <div className="d-flex justify-content-center flex-sm-row flex-column-reverse mt-4">
              <button className="button is-link mx-sm-2 mt-2">
                <Link
                  style={{ textDecoration: "None", color: "white" }}
                  to={`/psifos/${shortName}/trustee/${uuidTrustee}/home`}
                >
                  Volver atrás
                </Link>
              </button>
            </div>
            <div className="mt-4"></div>
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

export default DecryptProve;
