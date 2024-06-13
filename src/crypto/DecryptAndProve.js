import { backendOpIP } from "../server";

import Crypto from "./Crypto";
import { getEgParams } from "../services/crypto";

export default class DecryptAndProve extends Crypto {
  constructor(shortName, uuidTrustee, { reactFunctions } = {}) {
    super({ reactFunctions });

    this.shortName = shortName;
    this.uuidTrustee = uuidTrustee;

    this.params = null;
    this.certificates = null;
    this.points = null;
    this.election = null;
    this.trustee = null;
    this.trusteeCrypto = null;
    this.descriptions = {};
    this.workers = {};
    this.resultWorkers = {};
    this.workersQuestions = {};
    this.finalTally = [];
    this.totalWorkers = navigator.hardwareConcurrency
      ? Math.max(navigator.hardwareConcurrency, 4)
      : 1;
    this.questionsComplete = {};
    this.totalTally = {};
    this.lengthTally = null;
  }

  async getDecrypt() {
    const url =
      backendOpIP +
      "/" +
      this.shortName +
      "/trustee/" +
      this.uuidTrustee +
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
  }

  async sendDecrypt(descriptions) {
    this.reactFunction("setFeedbackMessage", "Enviando información...");
    const url =
      backendOpIP +
      "/" +
      this.shortName +
      "/trustee/" +
      this.uuidTrustee +
      "/decrypt-and-prove";
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(descriptions),
    });
    if (response.status === 200) {
      this.reactFunction(
        "setFeedbackMessage",
        "Desencriptación Parcial Completada ✓"
      );
      this.reactFunction("setActualStep", 2);
      const jsonResponse = await response.json();
      return jsonResponse;
    } else {
      this.reactFunction(
        "setFeedbackMessage",
        "Error al enviar información, intente nuevamente"
      );
      this.reactFunction("setActualStep", 0);
    }
  }

  createWorker(bash, sk, q_num, worker_num, group, with_votes) {
    const worker = new Worker(new URL("./decrypt-worker.js", import.meta.url));
    worker.postMessage({
      params: this.params,
      trustee: this.trustee,
      trustee_crypto: this.trusteeCrypto,
      election: this.election,
      secretKey: sk,
      certificates: this.certificates,
      points: this.points,
      tally: bash,
    });

    const self = this;

    const checkAndSendAux = this.check_and_send.bind(this);
    const reactFunction = this.reactFunction.bind(this);

    worker.onmessage = function (event) {
      if (event.data.type === "log") return console.log(event.data.msg);
      if (event.data.type === "error") {
        reactFunction("setFeedbackMessage", event.data.message);
        reactFunction("setActualStep", 0);
        return;
      }
      if (event.data.type === "result") {
        const tally_factors_and_proof = event.data.tally_factors_and_proof;

        // Guardamos los tally de cada worker
        self.resultWorkers[group][q_num][worker_num] = tally_factors_and_proof;
        self.workers[group][q_num] = self.workers[group][q_num] + 1;

        // Si es el ultimo worker, une las desencriptaciones
        if (
          self.workers[group][q_num] === self.workersQuestions[group][q_num]
        ) {
          let factor_proofs = {
            decryption_factors: [],
            decryption_proofs: [],
            tally_type: "",
          };

          // Resultados ordenados
          self.resultWorkers[group][q_num].forEach((result) => {
            factor_proofs.decryption_factors =
              factor_proofs.decryption_factors.concat(
                result.decryption_factors
              );
            factor_proofs.decryption_proofs =
              factor_proofs.decryption_proofs.concat(result.decryption_proofs);
            factor_proofs.tally_type = result.tally_type;
          });
          self.descriptions[group][q_num] = factor_proofs;
          self.questionsComplete[group] = self.questionsComplete[group] + 1;
        }
        // En caso de que terminamos todas las preguntas
        if (self.questionsComplete[group] === self.totalTally[group]) {
          self.finalTally.push({
            group: group,
            with_votes: with_votes,
            decryptions: self.descriptions[group],
          });
          checkAndSendAux();
        }
      }
    };
  }

  check_and_send() {
    if (this.lengthTally === this.finalTally.length) {
      this.sendDecrypt(this.finalTally);
    }
  }

  handlerDecrypt(sk) {
    getEgParams(this.shortName).then((eg_params) => {
      this.getDecrypt().then((data) => {
        this.params = JSON.parse(eg_params);
        this.certificates = JSON.parse(data.certificates);
        this.points = JSON.parse(data.points);
        this.election = data.election;
        this.trustee = data.trustee;
        this.trusteeCrypto = data.trustee_crypto;

        if (!sk) {
          this.reactFunction(
            "setFeedbackMessage",
            "Formato de archivo incorrecto"
          );
          this.reactFunction("setActualStep", 0);
          return;
        }
        let tallyGrouped = JSON.parse(this.election.encrypted_tally);
        this.lengthTally = tallyGrouped.filter((element) => {
          return element.with_votes === "True";
        }).length;
        tallyGrouped.forEach((element) => {
          try {
            if (element.with_votes === "True") {
              this.doTally(
                element.tally,
                sk,
                element.group,
                element.with_votes
              );
            }
          } catch (e) {
            console.error("error");
          }
        });
      });
    });
  }

  doTally(tally, sk, group, with_votes) {
    this.totalTally[group] = tally.length;
    this.questionsComplete[group] = 0;
    this.workers[group] = [];
    this.resultWorkers[group] = [];
    this.workersQuestions[group] = [];
    this.descriptions[group] = [];
    tally.forEach((t, q_num) => {
      const size = Math.ceil(t.tally.length / this.totalWorkers);
      this.workers[group][q_num] = 0;

      // Caso de tally pequeño, solo un hilo de ejecución
      this.resultWorkers[group][q_num] = [];
      if (size < 10) {
        this.workersQuestions[group][q_num] = 1;
        this.createWorker(t, sk, q_num, 0, group, with_votes);
      } else {
        // Seteamos la cantidad total de workers
        this.workersQuestions[group][q_num] = this.totalWorkers;

        for (let i = 0; i < this.totalWorkers; i++) {
          // Copiamos el tally y repartimos el arreglo
          let bash = { ...t };
          bash.tally = t.tally.slice(size * i, size * (i + 1));
          this.createWorker(bash, sk, q_num, i, group, with_votes);
        }
      }
    });
  }
}
