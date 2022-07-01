import { ElGamal } from "./elgamal";

var _ = require("lodash");

class TallyFactory {
  /**
   * Class factory for creating a tally object.
   */

  create(tally_type, computed, num_tallied, public_key, question, raw_tally) {
    if (tally_type === "homomorphic") {
      return new HomomorphicTally(
        computed,
        num_tallied,
        public_key,
        question,
        raw_tally
      );
    }
  }
}

class Tally {
  /**
   * Abstract class for tally objects.
   * @param {string} computed - the computed value of the tally
   * @param {number} num_tallied - number of tally
   * @param {PublicKey} public_key - election public key
   * @param {Question} question - election question
   * @param {array} raw_tally - the raw tally data
   */

  constructor(computed, num_tallied, public_key, question, raw_tally) {
    this.computed = computed;
    this.num_tallied = num_tallied;
    this.public_key = public_key;
    this.question = question;
    this.tally = raw_tally;
  }

  doDecrypt(public_key, secret_key) {
    /**
     * Decrypts the tally.
     * @param {PublicKey} public_key - election public key
     * @param {SecretKey} secret_key - trustee secret key
     * @return {Tally}
     */

    // we need to keep track of the values of g^{voter_num} for decryption
    // var DISCRETE_LOGS = {};
    // var CURRENT_EXP = 0;
    // var CURRENT_RESULT = BigInt.ONE;
    // DISCRETE_LOGS[CURRENT_RESULT.toString()] = CURRENT_EXP;

    // // go through the num_tallied
    // while (CURRENT_EXP < tally.num_tallied) {
    //   CURRENT_EXP += 1;
    //   CURRENT_RESULT = CURRENT_RESULT.multiply(public_key.g).mod(public_key.p);
    //   DISCRETE_LOGS[CURRENT_RESULT.toString()] = CURRENT_EXP;
    // }

    // initialize the arrays
    var decryption_factors = [];
    var decryption_proofs = [];

    // decrypt the tallies

    this.tally.forEach(function (choice_tally, choice_num) {
      var one_choice_result = secret_key.decryptionFactorAndProof(
        choice_tally,
        ElGamal.fiatshamir_challenge_generator
      );

      decryption_factors[choice_num] = one_choice_result.decryption_factor.toString();
      decryption_proofs[choice_num] =
        one_choice_result.decryption_proof.toJSONObject();
    });

    return {
      tally_type: this.tally_type,
      decryption_factors: decryption_factors,
      decryption_proofs: decryption_proofs,
    };
  }

  toJSONObject() {
    /**
     * Returns the JSON object representing this tally.
     * @return {object}
     */

    let tally_json_obj = _(this.tally).map(function (one_q) {
      return _(one_q).map(function (one_a) {
        return one_a.toJSONObject();
      });
    });

    return {
      num_tallied: this.num_tallied,
      tally: tally_json_obj,
    };
  }
}

class HomomorphicTally extends Tally {
  /**
   * Class for homomorphic tallies.
   */

  constructor(computed, num_tallied, public_key, question, raw_tally) {
    super(computed, num_tallied, public_key, question, raw_tally);
    this.tally_type = "homomorphic";
  }
}

Tally.fromJSONObject = function (json_tallies, public_key) {
  /**
   * Create a tally object from a JSON object.
   * @param {Object} json_tallies - a JSON with tallies
   * @param {PublicKey} public_key - election public key
   */

  var raw_tally = json_tallies.tally.map(function (one_q) {
    var new_val = ElGamal.Ciphertext.fromJSONObject(one_q, public_key);
    return new_val;
  });

  return new TallyFactory().create(
    json_tallies.tally_type,
    json_tallies.computed,
    json_tallies.num_tallied,
    json_tallies.public_key,
    json_tallies.question,
    raw_tally
  );
};

Tally.createAllTally = function (array_tally, public_key) {
  /**
   * Create a tally object from an array of tallies.
   * @param {Array} array_tally - an array of tallies
   * @param {PublicKey} public_key - election public key
   */

  let tally = [];
  for (let i = 0; i < array_tally.length; i++) {
    tally.push(Tally.fromJSONObject(array_tally[i], public_key));
  }
  return tally;
};

export default Tally;
