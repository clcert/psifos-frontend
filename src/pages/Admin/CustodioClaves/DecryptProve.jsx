import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { BigInt } from "../../../static/cabina/js/jscrypto/bigint";
import { ElGamal } from "../../../static/cabina/js/jscrypto/elgamal";
import { helios_c } from "../../../static/cabina/js/jscrypto/heliosc-trustee";
import { backendIP } from "../../../server";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import imageTrustees from "../../../static/svg/trustees2.svg";
import Tally from "../../../static/cabina/js/jscrypto/tally";

function DecryptProve(props) {
  const [trustee, setTrustee] = useState("");
  const [election, setElection] = useState("");
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

  async function getDescrypt() {
    const url = "/" + uuid + "/trustee/" + uuidTrustee + "/decrypt-and-prove";
    const response = await fetch(url, {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const jsonResponse = await response.json();
    return jsonResponse;
  }

  async function sendDescrypt() {
    setFeedbackMessage("Enviando información...");
    const url = "/" + uuid + "/trustee/" + uuidTrustee + "/decrypt-and-prove";
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

  useEffect(() => {
    let params_aux, certificates_aux, points_aux, election_aux, trustee_aux;

    getDescrypt().then((data) => {
      params_aux = JSON.parse(data.params);
      certificates_aux = JSON.parse(data.certificates);
      points_aux = JSON.parse(data.points);
      election_aux = data.election;
      trustee_aux = JSON.parse(data.trustee);

      setParams(params_aux);
      setCertificates(certificates_aux);
      setPoints(points_aux);
      setElection(election_aux);
      setTrustee(trustee_aux);

      BigInt.setup(function () {
        let PARAMS = ElGamal.Params.fromJSONObject(params_aux);
        PARAMS.trustee_id = trustee_aux.trustee_id;
        setParams(PARAMS);
        let ELECTION_JSON = JSON.parse(election_aux);
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
  }, []);

  useEffect(() => {
    if (generateDecrypt) {
      do_tally();
    }
  }, [generateDecrypt]);

  // function decrypt_and_prove_tally(tally, public_key, secret_key) {
  //   // we need to keep track of the values of g^{voter_num} for decryption
  //   // var DISCRETE_LOGS = {};
  //   // var CURRENT_EXP = 0;
  //   // var CURRENT_RESULT = BigInt.ONE;
  //   // DISCRETE_LOGS[CURRENT_RESULT.toString()] = CURRENT_EXP;

  //   // // go through the num_tallied
  //   // while (CURRENT_EXP < tally.num_tallied) {
  //   //   CURRENT_EXP += 1;
  //   //   CURRENT_RESULT = CURRENT_RESULT.multiply(public_key.g).mod(public_key.p);
  //   //   DISCRETE_LOGS[CURRENT_RESULT.toString()] = CURRENT_EXP;
  //   // }

  //   // initialize the arrays
  //   var decryption_factors = [];
  //   var decryption_proofs = [];

  //   // decrypt the tallies

  //   tally.tally.forEach(function (choice_tally, choice_num) {
  //     var one_choice_result = secret_key.decryptionFactorAndProof(
  //       choice_tally,
  //       ElGamal.fiatshamir_challenge_generator
  //     );

  //     decryption_factors[choice_num] = one_choice_result.decryption_factor;
  //     decryption_proofs[choice_num] =
  //       one_choice_result.decryption_proof.toJSONObject();
  //   });

  //   return {
  //     tally_type: tally.tally_type,
  //     decryption_factors: decryption_factors,
  //     decryption_proofs: decryption_proofs,
  //   };
  // }

  function decrypt_open_answers(mixnet_open_answers, public_key, secret_key) {
    let open_answers = JSON.parse(mixnet_open_answers)["open_answers"];
    let decryption_factors = [];
    let decryption_proofs = [];
    open_answers.forEach(function (q_open_answers, q_num) {
      decryption_factors[q_num] = [];
      decryption_proofs[q_num] = [];

      q_open_answers["answers"].forEach(function (enc_ans, ans_num) {
        let enc_ans_ciphertext = ElGamal.Ciphertext.fromJSONObject(
          enc_ans,
          public_key
        );
        let ans_result = secret_key.decryptionFactorAndProof(
          enc_ans_ciphertext,
          ElGamal.fiatshamir_challenge_generator
        );
        decryption_factors[q_num][ans_num] = ans_result.decryption_factor;
        decryption_proofs[q_num][ans_num] =
          ans_result.decryption_proof.toJSONObject();
      });
    });
    return {
      decryption_factors: decryption_factors,
      decryption_proofs: decryption_proofs,
    };
  }

  function get_secret_key() {
    helios_c.trustee = helios_c.trustee_create(params, secretKey);
    helios_c.params = params;
    helios_c.certificates = certificates;
    helios_c.points = points;
    // TODO: check key
    var sk = helios_c.ui_share_get_direct();
    return new ElGamal.SecretKey(sk.x, sk.public_key);
  }

  async function do_tally() {
    var secret_key = get_secret_key();

    // ENCRYPTED TALLY :
    let tally_factors_and_proof = tally.map(function (q_tally) {
      return q_tally.doDecrypt(electionPk, secret_key);
    });

    let final_json = {
      decryptions: tally_factors_and_proof,
    };
    console.log(final_json);
    console.log(JSON.stringify(final_json));
    setDescriptions(JSON.stringify(final_json));
    setFeedbackMessage("Listo para enviar el desencriptado parcial");
    setTallyReady(true);

    // var tally_factors_and_proof = decrypt_and_prove_tally(
    //   TALLY,
    //   ELECTION_PK,
    //   secret_key
    // );

    // json'ify it
    // var tally_factors = tally_factors_and_proof.decryption_factors;
    // let tally_decryption_proofs = tally_factors_and_proof.map(function (
    //   q_proof
    // ) {
    //   console.log("q_proof", q_proof);
    //   return q_proof.decryption_proofs.map(function (a_proof) {
    //     console.log("a_proof", a_proof);
    //     return a_proof.toJSONObject();
    //   });
    // });

    // console.log("tally json", tally_decryption_proofs)

    // var tally_factors_and_proofs = {
    //   decryption_factors: tally_factors,
    //   decryption_proofs: tally_decryption_proofs,
    // };

    // console.log(tally_factors_and_proofs);

    // // ENCRYPTED OPEN ANSWERS :
    // let open_answers_factors_and_proofs;
    // if (ELECTION_JSON["mixnet_open_answers"] !== null) {
    //   open_answers_factors_and_proofs = decrypt_open_answers(
    //     ELECTION_JSON["mixnet_open_answers"],
    //     ELECTION_PK,
    //     secret_key
    //   );
    // } else {
    //   open_answers_factors_and_proofs = {
    //     decryption_factors: [],
    //     decryption_proofs: [],
    //   };
    // }

    // // CREATE FINAL JSON:
    // let factors_and_proofs = {
    //   answers: tally_factors_and_proofs,
    //   open_answers: open_answers_factors_and_proofs,
    // };
    // let factors_and_proofs_json = $.toJSON(factors_and_proofs);

    // // clear stuff
    // secret_key = null;
    // $("#sk_textarea").val("");

    // // display the result in a text area.
    // $("#waiting_div").hide();

    // $("#result_textarea").html(factors_and_proofs_json);
    // $("#result_div").show();
    // $("#first-step-success").show();
  }

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            adressExit={backendIP + "/" + uuid + "/trustee" + "/logout"}
            addressInit={"/" + uuid + "/trustee/" + uuidTrustee + "/home"}
          />
          <Title
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
                  to={"/" + uuid + "/trustee/" + uuidTrustee + "/home"}
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
