import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { backendIP } from "../../../../server";
import { logout, translateStep } from "../../../../utils/utils";
import Status from "../../AdministrationPanel/component/Status";

function CardElection(props) {
  const [totalVotes, setTotalVotes] = useState(0);

  /** @state {bool} election have questions */
  const [haveQuestions, setHaveQuestions] = useState(true);

  /** @state {bool} election have voters */
  const [haveVoters, setHaveVoters] = useState(true);

  /** @state {bool} election have audit */
  const [totalVoters, setTotalVoters] = useState(0);

  /** @state {bool} election have trustee */
  const [haveTrustee, setHaveTrustee] = useState(true);

  const [electionStatus, setElectionStatus] = useState("");

  useEffect(() => {
    setElectionStatus(props.electionStatus);
  }, [props.electionStatus]);

  useEffect(() => {
    async function getStats() {
      const token = sessionStorage.getItem("token");
      const resp = await fetch(
        backendIP + "/get-election-stats/" + props.election.uuid,
        {
          method: "GET",
          headers: {
            "x-access-tokens": token,
            "Content-Type": "application/json",
          },
        }
      );
      if (resp.status === 200) {
        const jsonResponse = await resp.json();
        setTotalVoters(jsonResponse.total_voters);
        setTotalVotes(jsonResponse.num_casted_votes);
      } else if (resp.status === 401) {
        logout();
      }
    }
    getStats();
    setElectionStatus(translateStep(props.electionStatus));
    setHaveQuestions(props.election.questions !== "");
    setHaveVoters(props.election.voters.length > 0);
    setHaveTrustee(props.election.trustees.length > 0);
  }, []);

  return (
    <div className="box ">
      <div className="is-size-4">
        {props.election.name}{" | "}
        <span className="is-size-6">
          <Link
            className="link-without-line"
            to={"/admin/" + props.election.uuid + "/panel"}
          >
            Ver Panel
          </Link>
        </span>
      </div>

      <hr />
      <div className="content-card-admin">
        <span className="panel-text-sect">
          Estado: {electionStatus}
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
          uuid={props.election.uuid}
          haveVoters={haveVoters}
          electionStatus={electionStatus}
          haveQuestions={haveQuestions}
          haveTrustee={haveTrustee}
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
