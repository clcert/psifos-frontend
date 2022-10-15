import { useParams } from "react-router-dom";
import sendImage from "../../../static/booth/svg/send-img.svg";
import InvalidatedVote from "./CastDone/InvalidatedVote";
import PendingVote from "./CastDone/PendingVote";
import ValidatedVote from "./CastDone/ValidatedVote";

function CastDone(props) {

  return (
    <section className="section pb-0" id="send-section">
      <div className="container has-text-centered is-max-desktop">
        {props.voteVerificated && <ValidatedVote voteHash={props.voteHash} />}
        {!props.voteVerificated && <InvalidatedVote />}
        {props.voteVerificated === null && <PendingVote voteHash={props.voteHash} />}
      </div>

      <figure className="image send-img-wrapper pt-4">
        <img id="send-final-img" src={sendImage} alt="" />
      </figure>
    </section>
  );
}

export default CastDone;
