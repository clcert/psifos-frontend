import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../../../../services/election";
import { translateStep } from "../../../../utils/utils";
import Status from "../../AdministrationPanel/component/Status";

function CardElection(props) {
  /** @state {num} total election votes */
  const [totalVotes, setTotalVotes] = useState(0);

  /** @state {num} election have audit */
  const [totalVoters, setTotalVoters] = useState(0);

  /** @state {string} election status */
  const [electionStatus, setElectionStatus] = useState("");

  useEffect(() => {
    setElectionStatus(props.electionStatus);
  }, [props.electionStatus]);

  useEffect(() => {
    getStats(props.election.short_name).then((res) => {
      const { jsonResponse } = res;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
    });

    setElectionStatus(props.electionStatus);
  }, []);

  return (
    <div className="box ">
      <div className="is-size-4">
        {props.election.name}
        {" | "}
        <span className="is-size-6">
          <Link
            className="link-without-line"
            to={"/psifos/admin/" + props.election.short_name + "/panel"}
          >
            Ver Panel
          </Link>
        </span>
      </div>

      <hr />
      <div className="content-card-admin">
        <span className="panel-text-sect">
          Estado: {translateStep(electionStatus)}
        </span>
      </div>
      <div className="content-card-admin">
        <span className="panel-text-sect">
          Cantidad de votantes: {totalVoters}
        </span>
      </div>
      <div className="content-card-admin">
        <span className="panel-text-sect">Cantidad de votos: {totalVotes}</span>
      </div>
      <hr />
      <div>
        <span className="panel-text-sect">Proximos pasos:</span>
        <Status
          election={props.election}
          electionStatus={electionStatus}
          freezeModal={props.freezeModal}
          closeModal={props.closeModal}
          tallyModal={props.tallyModal}
          combineTallyModal={props.combineTallyModal}
          uploadModalonClick={(value) => {
            props.uploadModalonClick(value);
          }}
        />
      </div>
    </div>
  );
}

export default CardElection;
