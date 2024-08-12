import { BOOTH } from "../../static/booth/js/booth";
import { BigInt } from "../../static/booth/js/jscrypto/bigint";
import { USE_SJCL } from "../../static/booth/js/jscrypto/bigint";
import { sjcl } from "../../static/booth/js/jscrypto/sjcl";
import { BigIntDummy } from "../../static/booth/js/jscrypto/bigintDummy.js";
import { backendOpIP } from "../../server";

class BoothPsifos {
  /** Class in charge of handling the Helios BOOTH */

  constructor(election_data, election_metadata, preview) {
    if (!preview) {
      if (USE_SJCL) {
        sjcl.random.startCollectors();
      }

      // // we're asynchronous if we have SJCL and Worker
      BOOTH.synchronous = !(USE_SJCL && window.Worker);

      // // we do in the browser only if it's asynchronous
      BigInt.in_browser = !BOOTH.synchronous;

      // // set up dummy bigint for fast parsing and serialization
      if (!BigInt.in_browser) BigInt = BigIntDummy;

      //BigInt.setup(BOOTH.so_lets_go, BOOTH.nojava);

      BOOTH.election_metadata = election_metadata;
      BOOTH.setup_election(election_data, election_metadata);
    }
  }

  getBooth() {
    return BOOTH;
  }

  validateAllQuestions(answersQuestions) {
    /**
     * validate all questions with BOOTH
     * @param {array} answersQuestions
     *
     */
    for (let i = 0; i < answersQuestions.length; i++) {
      BOOTH.validate_question(i);
    }
  }

  sendEncryp(answersQuestions) {
    /**
     * Create encryp answers
     */

    BOOTH.ballot.answers = answersQuestions;
    BOOTH.ballot.open_answers = [];
    this.validateAllQuestions(answersQuestions);
    BOOTH.seal_ballot();
  }

  async sendJson(uuid) {
    /**
     * Send encryp answers to the server
     */

    const url = backendOpIP + "/" + uuid + "/cast-vote";
    const response = await fetch(url, {
      method: "POST",
      credentials: "include",

      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        encrypted_vote: BOOTH.encrypted_vote_json,
      }),
    });
    const data = await response.json();
    return data;
  }
}
export default BoothPsifos;
