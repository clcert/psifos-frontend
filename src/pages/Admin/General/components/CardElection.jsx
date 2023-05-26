import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../../../../services/election";
import { translateStep } from "../../../../utils/utils";
import Status from "../../AdministrationPanel/component/Status";

function Header({
  electionName, electionShortName, configRoute
}) {
  return (
    <div className="election-header">
        <div className="">
          <div className="is-size-3">{electionName}</div>
          <div className="is-size-4">{electionShortName}</div>
        </div>
        <span className="is-size-6">
          <Link
            className="link-without-line"
            to={configRoute}
          >
            <i class="fa-solid fa-screwdriver-wrench mr-2"/>
            <span>Configuraciones</span>
          </Link>
        </span>
      </div>
  )
}

function MainInfo({
  state, totalVoters, totalVotes,
}) {
  return (
    <>
      <div className="content-card-admin">
        <span className="panel-text-sect">
          Estado: {state}
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
    </>
  )
}

function NextSteps({
  election, electionStatus, freezeModal, closeModal,
  tallyModal, combineTallyModal, uploadModalonClick,
}) {
  return (
    <div>
      <span className="panel-text-sect">Proximos pasos:</span>
      <Status
        election={election}
        electionStatus={electionStatus}
        freezeModal={freezeModal}
        closeModal={closeModal}
        tallyModal={tallyModal}
        combineTallyModal={combineTallyModal}
        uploadModalonClick={(value) => {
          uploadModalonClick(value);
        }}
      />
    </div>
  )
}

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
    <div className="box info-general">
      <Header 
        electionName={props.election.name}
        electionShortName={props.election.short_name}
        configRoute={"/psifos/admin/" + props.election.short_name + "/panel"}
      />
      <hr />
      <MainInfo
        state={translateStep(electionStatus)}
        totalVoters={totalVoters}
        totalVotes={totalVotes}
      />
      <hr />
      <NextSteps 
        election={props.election}
        electionStatus={electionStatus}
        freezeModal={props.freezeModal}
        closeModal={props.closeModal}
        tallyModal={props.tallyModal}
        combineTallyModal={props.combineTallyModal}
        uploadModalonClick={props.uploadModalonClick}
      />
    </div>
  );
}

export default CardElection;
