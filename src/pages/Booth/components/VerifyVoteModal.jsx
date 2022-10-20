import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../server";
import encryptingGIF from "../../../static/img/encrypting.gif";

function VerifyVoteModal(props) {
  const { uuid } = useParams();

  async function getVote() {
    const url = backendInfoIp + "/election/" + uuid + "/cast-vote/";
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        hash_vote: props.voteHash,
      }),
    });

    const jsonResponse = await resp.json();
    if (jsonResponse.cast_at !== null) {
      props.setVoteVerificates(true);
      props.afterVerify();
    } else if (jsonResponse.invalidated_at !== null) {
      props.setVoteVerificates(false);
      props.afterVerify();
    }
  }

  useEffect(() => {
    if (props.show) {
      let intervalTotal = setInterval(() => {
        props.afterVerify();
      }, 15000);

      let interval = setInterval(getVote, 1000);
      return () => {
        clearInterval(interval);
        clearInterval(intervalTotal);
      };
    }
  }, [props.show]);

  return (
    <div className={"modal " + (props.show ? "is-active" : "")} id="help-modal">
      <div className="modal-background"></div>
      <div className="modal-card has-text-centered">
        <section className="modal-card-body">
          <p className="has-text-weight-bold is-size-5">
            VALIDANDO TU VOTO <br />
            POR FAVOR ESPERA UN MOMENTO
          </p>
          <img className="mt-2" src={encryptingGIF} />
        </section>
      </div>
    </div>
  );
}

export default VerifyVoteModal;
