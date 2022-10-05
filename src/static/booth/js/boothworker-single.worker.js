/*
 * JavaScript HTML 5 Worker for BOOTH
 */

// import needed resources
import { HELIOS } from "./jscrypto/helios";
import { BigInt } from "./jscrypto/bigint";
import { ElGamal } from "./jscrypto/elgamal";
import EncryptedAnswerFactory from "./jscrypto/encypted-answers";

var console = {
  log: function (msg) {
    postMessage({ type: "log", msg: msg });
  },
};

var ELECTION = null;

function do_setup(message) {
  console.log("setting up worker");

  ELECTION = HELIOS.Election.fromJSONString(message.election);
}

function do_encrypt(message) {
  console.log(
    "encrypting answer for question " + ELECTION.questions[message.q_num]
  );

  let data = {
    type: "result",
    q_num: message.q_num,
    id: message.id,
    q_type: message.q_type
    // });
  };

  console.log("EMPIEZA A ENCRIPTAR");
  var encrypted_answer = new EncryptedAnswerFactory().create(
    message.q_type,
    ELECTION.questions[message.q_num],
    message.answer,
    ELECTION.public_key
  );
  data.encrypted_answer = encrypted_answer.toJSONObject(true);


  let encrypted_open_answer = null;
  if (message.q_type === "open_questionn") {
    data.enc_ans_type = "encrypted_open_answer";
    console.log("encrypting open answer for question " + message.q_num);
    let encrypt_open_answer = (answer) => {
      console.log("ANSWER: -" + answer + "-");

      let from_bytearray_to_hexstring = (byteArray) => {
        return Array.from(byteArray, (byte) => {
          return ("0" + (byte & 0xff).toString(16)).slice(-2);
        }).join("");
      };

      let answer_bytearray =
        answer != "" ? new TextEncoder().encode(answer) : [0];
      let hexstring_answer = from_bytearray_to_hexstring(answer_bytearray);
      console.log("BYTEARRAY: " + answer_bytearray);
      console.log(
        "HEXSTRING: " + from_bytearray_to_hexstring(answer_bytearray)
      );

      let answer_bi = new BigInt(hexstring_answer, 16);
      console.log("answer_bi: " + answer_bi.toString());
      let answer_pt = new ElGamal.Plaintext(
        answer_bi,
        ELECTION.public_key,
        true
      );
      console.log("answer_pt.m: " + answer_pt.m);
      let answer_enc = ElGamal.encrypt(ELECTION.public_key, answer_pt);

      return {
        alpha: answer_enc.alpha.toJSONObject(),
        beta: answer_enc.beta.toJSONObject(),
      };
    };
    encrypted_open_answer = encrypt_open_answer(message.open_answer[0]);
    data.encrypted_open_answer = encrypted_open_answer;
  }

  console.log("done encrypting");

  // send the result back
  postMessage(JSON.parse(JSON.stringify(data)));
}

// receive either
// a) an election and an integer position of the question
// that this worker will be used to encrypt
// {'type': 'setup', 'election': election_json}
//
// b) an answer that needs encrypting
// {'type': 'encrypt', 'q_num': 2, 'id': id, 'answer': answer_json}
//
onmessage = function (event) {
  // dispatch to method
  if (event.data.type === "setup") {
    do_setup(event.data);
  } else if (event.data.type === "encrypt") {
    do_encrypt(event.data);
  }
};
