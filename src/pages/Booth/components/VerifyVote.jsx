import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../server";

function VerifyVote(props) {
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
    let intervalTotal = setInterval(() => {
      props.afterVerify();
    }, 15000);

    let interval = setInterval(getVote, 1000);
    return () => {
      clearInterval(interval);
      clearInterval(intervalTotal);
    };
  }, []);

  return (
    <section
      className="section pb-0 is-flex is-flex-direction-column is-align-items-center"
      id="review-section"
    >
      <div className="container has-text-centered is-max-desktop">
        <p className="subtitle is-3 has-text-black mb-1">
          Estamos validando tu voto
        </p>
        <p className="subtitle is-4 mb-1     has-text-black mb-1">
          Este proceso puede tomar unos segundos
        </p>
      </div>
      <div className="spinner-animation mb-2"></div>
    </section>
  );
}

export default VerifyVote;
