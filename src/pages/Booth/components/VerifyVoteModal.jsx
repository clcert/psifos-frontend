import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../server";
import encryptingGIF from "../../../static/img/encrypting.gif";

function VerifyVoteModal(props) {
  const { uuid } = useParams();

  async function getVote() {
    const voteHashEncode = encodeURIComponent(props.voteHash);
    const url =
      backendInfoIp + "/election/" + uuid + "/cast-vote/" + voteHashEncode;
    const resp = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonResponse = await resp.json();
    if (jsonResponse.cast_at !== null && resp.status === 200) {
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
        <section className="modal-card-body single-card">
          <p className="has-text-weight-bold is-size-5">
            VALIDANDO TU VOTO <br />
            POR FAVOR ESPERA UN MOMENTO
          </p>
          <img className="mt-2" src={encryptingGIF} />
          <p className="subtitle mt-4">Se está verificando que el voto se realizó correctamente</p>
        </section>
      </div>
    </div>
  );
}

export default VerifyVoteModal;
