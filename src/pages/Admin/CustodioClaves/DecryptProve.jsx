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

function DecryptProve(props) {
  const [trustee, setTrustee] = useState("");
  const [params, setParams] = useState({});
  const [secretKey, setSecretKey] = useState("");
  const [certificates, setCertificates] = useState({});
  const [points, setPoints] = useState({});
  const [tally, setTally] = useState({});
  const [descriptions, setDescriptions] = useState({});
  const [electionPk, setElectionPk] = useState("");
  const [tallyReady, setTallyReady] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState(
    "Cargando información..."
  );
  const [generateDecrypt, setGenerateDecrypt] = useState(false);

  const { uuid, uuidTrustee } = useParams();

  const getDescrypt = useCallback(async () => {
    const url =
      backendOpIP +
      "/" +
      uuid +
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
  }, [uuid, uuidTrustee]);

  async function sendDescrypt() {
    setFeedbackMessage("Enviando información...");
    const url =
      backendOpIP +
      "/" +
      uuid +
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
      setFeedbackMessage("Información enviada");
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      setFeedbackMessage("Error al enviar información, intente nuevamente");
      setGenerateDecrypt(false);
      setTallyReady(false);
    }
  }

  const get_secret_key = useCallback(() => {
    helios_c.trustee = helios_c.trustee_create(params, secretKey);
    helios_c.params = params;
    helios_c.certificates = certificates;
    helios_c.points = points;
    // TODO: check key
    var sk = helios_c.ui_share_get_direct();
    return new ElGamal.SecretKey(sk.x, sk.public_key);
  }, [certificates, params, points, secretKey]);

  const do_tally = useCallback(() => {
    var secret_key = get_secret_key();

    // ENCRYPTED TALLY :
    let tally_factors_and_proof = tally.map(function (q_tally) {
      return q_tally.doDecrypt(electionPk, secret_key);
    });

    console.log(tally_factors_and_proof)

    let final_json = {
      decryptions: tally_factors_and_proof,
    };
    setDescriptions(JSON.stringify(final_json));
    setFeedbackMessage("Listo para enviar el desencriptado parcial");
    setTallyReady(true);
  }, [electionPk, get_secret_key, tally]);

  useEffect(() => {
    let params_aux, certificates_aux, points_aux, election_aux, trustee_aux;

    getEgParams(uuid).then((eg_params) => {
      getDescrypt().then((data) => {
        params_aux = JSON.parse(eg_params);
        certificates_aux = JSON.parse(data.certificates);
        points_aux = JSON.parse(data.points);
        election_aux = data.election;
        trustee_aux = data.trustee;

        setParams(params_aux);
        setCertificates(certificates_aux);
        setPoints(points_aux);
        setTrustee(trustee_aux);

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
        setFeedbackMessage("Listo para generar desencriptado parcial");
      });
    });
  }, [getDescrypt]);

  useEffect(() => {
    if (generateDecrypt) {
      do_tally();
    }
  }, [generateDecrypt, do_tally]);

  // function decrypt_open_answers(mixnet_open_answers, public_key, secret_key) {
  //   let open_answers = JSON.parse(mixnet_open_answers)["open_answers"];
  //   let decryption_factors = [];
  //   let decryption_proofs = [];
  //   open_answers.forEach(function (q_open_answers, q_num) {
  //     decryption_factors[q_num] = [];
  //     decryption_proofs[q_num] = [];

  //     q_open_answers["answers"].forEach(function (enc_ans, ans_num) {
  //       let enc_ans_ciphertext = ElGamal.Ciphertext.fromJSONObject(
  //         enc_ans,
  //         public_key
  //       );
  //       let ans_result = secret_key.decryptionFactorAndProof(
  //         enc_ans_ciphertext,
  //         ElGamal.fiatshamir_challenge_generator
  //       );
  //       decryption_factors[q_num][ans_num] = ans_result.decryption_factor;
  //       decryption_proofs[q_num][ans_num] =
  //         ans_result.decryption_proof.toJSONObject();
  //     });
  //   });
  //   return {
  //     decryption_factors: decryption_factors,
  //     decryption_proofs: decryption_proofs,
  //   };
  // }

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            linkExit={`${backendOpIP}/${uuid}/trustee/logout`}
            linkInit={`/${uuid}/trustee/${uuidTrustee}/home`}
          />
          <TitlePsifos
            namePage="Custodio de Claves"
            nameElection={"Etapa 3: Verificación clave privada"}
          />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          <div className="panel-info has-text-white mb-4">
            <p className="panel-text">
              <span className="panel-text-sect">Custodio</span>: {trustee.name}
            </p>
          </div>
        </div>
        <div className="container has-text-centered has-text-white is-max-desktop">
          <p>
            Se ha calculado el recuento cifrado de su elección.
            <br />
            Ahora es el momento de calcular y enviar su desencriptado parcial.
          </p>

          <div id="sk_section">
            <h3>Sube su clave secreta</h3>
            <textarea
              onChange={(e) => {
                setSecretKey(e.target.value);
              }}
              className="textarea"
              placeholder="Clave secreta"
              disabled={generateDecrypt}
            ></textarea>
            <div className="mt-2">{feedbackMessage}</div>

            <div className="mt-4">
              <button className="button mr-2">
                <Link
                  style={{ textDecoration: "None", color: "black" }}
                  to={`/psifos/${uuid}/trustee/${uuidTrustee}/home`}
                >
                  Volver atras
                </Link>
              </button>
              {!tallyReady ? (
                <button
                  className="button mr-2"
                  disabled={generateDecrypt}
                  onClick={() => {
                    setGenerateDecrypt(true);
                    setFeedbackMessage("Generando desencriptado parcial...");
                  }}
                >
                  Generar desencriptado parcial
                </button>
              ) : (
                <button
                  className="button mr-2"
                  onClick={() => {
                    sendDescrypt();
                  }}
                >
                  Enviar
                </button>
              )}
            </div>
            <div className="mt-4"></div>
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

export default DecryptProve;
