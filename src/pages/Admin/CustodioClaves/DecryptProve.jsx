import jquery from "jquery";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { backendIP } from "../../../server";
import { getTrustee, getTrusteeHome } from "../../../services/trustee";
import imageTrustees from "../../../static/svg/trustees2.svg";
import { BigInt } from "../../../static/cabina/js/jscrypto/bigint";
import { sjcl } from "../../../static/cabina/js/jscrypto/sjcl";
import { ElGamal } from "../../../static/cabina/js/jscrypto/elgamal";
import { helios_c } from "../../../static/cabina/js/jscrypto/heliosc-trustee";
import { HELIOS } from "../../../static/cabina/js/jscrypto/helios";
import $ from "jquery";

function DecryptProve(props) {
  const { uuid, uuidTrustee } = useParams();

  const [trustee, setTrustee] = useState("");
  const [election, setElection] = useState("");
  const [params, setParams] = useState({});
  const [certificates, setCertificates] = useState({});
  const [points, setPoints] = useState({});
  var TRUSTEE, CERTIFICATES, POINTS, ELECTION_JSON, ELECTION_PK, TALLY, PARAMS;

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

  useEffect(() => {
    let params_aux, certificates_aux, points_aux, election_aux, trustee_aux;

    getDescrypt().then((data) => {
      params_aux = JSON.parse(data.params);
      certificates_aux = JSON.parse(data.certificates);
      points_aux = data.points;
      election_aux = data.election;
      trustee_aux = JSON.parse(data.trustee);

      console.log(params_aux);
      console.log(certificates_aux);
      console.log(points_aux);
      console.log(election_aux);
      console.log(trustee_aux);

      setParams(params_aux);
      setCertificates(certificates_aux);
      setPoints(points_aux);
      setElection(election_aux);
      setTrustee(trustee_aux);

      BigInt.setup(function () {
        let PARAMS = ElGamal.Params.fromJSONObject(params_aux);
        PARAMS.trustee_id = trustee_aux.trustee_id;
        console.log(PARAMS);
        let ELECTION_JSON = JSON.parse(election_aux);
        console.log(ELECTION_JSON);
        let ELECTION_PK = ElGamal.PublicKey.fromJSONObject(
          ELECTION_JSON["public_key"]
        );
        TALLY = HELIOS.Tally.fromJSONObject(
          election.encrypted_tally.toJSON,
          ELECTION_PK
        );
        CERTIFICATES = election.certificates;
        POINTS = election.points;
        $("#sk_section").show();
      });
    });
  }, []);

  function decrypt_and_prove_tally(tally, public_key, secret_key) {
    // we need to keep track of the values of g^{voter_num} for decryption
    var DISCRETE_LOGS = {};
    var CURRENT_EXP = 0;
    var CURRENT_RESULT = BigInt.ONE;
    DISCRETE_LOGS[CURRENT_RESULT.toString()] = CURRENT_EXP;

    // go through the num_tallied
    while (CURRENT_EXP < tally.num_tallied) {
      CURRENT_EXP += 1;
      CURRENT_RESULT = CURRENT_RESULT.multiply(public_key.g).mod(public_key.p);
      DISCRETE_LOGS[CURRENT_RESULT.toString()] = CURRENT_EXP;
    }

    // initialize the arrays
    var decryption_factors = [];
    var decryption_proofs = [];

    // decrypt the tallies
    $(tally.tally).each(function (q_num, q_tally) {
      decryption_factors[q_num] = [];
      decryption_proofs[q_num] = [];

      $(q_tally).each(function (choice_num, choice_tally) {
        var one_choice_result = secret_key.decryptionFactorAndProof(
          choice_tally,
          ElGamal.fiatshamir_challenge_generator
        );

        decryption_factors[q_num][choice_num] =
          one_choice_result.decryption_factor;
        decryption_proofs[q_num][choice_num] =
          one_choice_result.decryption_proof;
      });
    });

    return {
      decryption_factors: decryption_factors,
      decryption_proofs: decryption_proofs,
    };
  }

  function decrypt_open_answers(mixnet_open_answers, public_key, secret_key) {
    let open_answers = JSON.parse(mixnet_open_answers)["open_answers"];
    let decryption_factors = [];
    let decryption_proofs = [];
    $(open_answers).each(function (q_num, q_open_answers) {
      decryption_factors[q_num] = [];
      decryption_proofs[q_num] = [];

      $(q_open_answers["answers"]).each(function (ans_num, enc_ans) {
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
    TRUSTEE = helios_c.trustee_create(PARAMS, $("#sk_textarea").val());
    // TODO: check key
    var sk = helios_c.ui_share.get_direct();
    return new ElGamal.SecretKey(sk.x, sk.public_key);
  }

  function do_tally() {
    $("#sk_section").hide();
    $("#waiting_div").show();

    var secret_key = get_secret_key();

    // ENCRYPTED TALLY :
    var tally_factors_and_proof = decrypt_and_prove_tally(
      TALLY,
      ELECTION_PK,
      secret_key
    );

    // json'ify it
    var tally_factors = tally_factors_and_proof.decryption_factors;
    var tally_decryption_proofs = $(
      tally_factors_and_proof.decryption_proofs
    ).map(function (i, q_proof) {
      return $(q_proof).map(function (j, a_proof) {
        return a_proof.toJSONObject();
      });
    });

    var tally_factors_and_proofs = {
      decryption_factors: tally_factors,
      decryption_proofs: tally_decryption_proofs,
    };

    // ENCRYPTED OPEN ANSWERS :
    let open_answers_factors_and_proofs;
    if (ELECTION_JSON["mixnet_open_answers"] !== null) {
      open_answers_factors_and_proofs = decrypt_open_answers(
        ELECTION_JSON["mixnet_open_answers"],
        ELECTION_PK,
        secret_key
      );
    } else {
      open_answers_factors_and_proofs = {
        decryption_factors: [],
        decryption_proofs: [],
      };
    }

    // CREATE FINAL JSON:
    let factors_and_proofs = {
      answers: tally_factors_and_proofs,
      open_answers: open_answers_factors_and_proofs,
    };
    let factors_and_proofs_json = $.toJSON(factors_and_proofs);

    // clear stuff
    secret_key = null;
    $("#sk_textarea").val("");

    // display the result in a text area.
    $("#waiting_div").hide();

    $("#result_textarea").html(factors_and_proofs_json);
    $("#result_div").show();
    $("#first-step-success").show();
  }

  function submit_result() {
    $("#result_div").hide();
    $("#waiting_submit_div").show();

    var result = $("#result_textarea").val();

    // do the post
    $.ajax({
      type: "POST",
      url: "./upload-decryption",
      data: { factors_and_proofs: result },
      success: function (result) {
        $("#waiting_submit_div").hide();
        if (result != "FAILURE") {
          $("#done_div").show();
        } else {
          alert("verification failed, you probably used the wrong key.");
          reset();
        }
      },
      error: function (error) {
        $("#waiting_submit_div").hide();
        $("#error_div").show();
      },
    });
  }

  function skip_to_second_step() {
    $("#sk_section").hide();
    $("#result_div").show();
    $("#result_textarea").html("");
    $("#skip_to_second_step_instructions").hide();
  }

  function reset() {
    $("#result_div").hide();
    $("#skip_to_second_step_instructions").show();
    $("#sk_section").show();
    $("#result_textarea").html("");
    $("#first-step-success").hide();
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
            The encrypted tally for your election has been computed.
            <br />
            Now it's time to compute and submit your partial decryption.
          </p>

          <div id="sk_section">
            <h3>Sube su clave secreta</h3>
            <textarea class="textarea" placeholder="Clave secreta"></textarea>

            <div className="mt-4">
              <button className="button mr-2" onClick="do_tally();">
                Generar desencriptado parcial
              </button>
            </div>
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
