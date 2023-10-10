import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getStats } from "../../../../services/election";
import Status from "../../AdministrationPanel/component/Status";
import { electionStatusTranslate } from "../../../../constants";

function Header({ electionName, electionShortName, configRoute }) {
  return (
    <div className="election-header">
      <div className="">
        <div className="is-size-3">{electionName}</div>
        <div className="is-size-4">{electionShortName}</div>
      </div>
      <span className="is-size-6">
        <Link className="link-without-line" to={configRoute}>
          <i className="fa-solid fa-screwdriver-wrench mr-2" />
          <span>Configuraciones</span>
        </Link>
      </span>
    </div>
  );
}

function MainInfo({ state, totalVoters, totalVotes }) {
  return (
    <>
      <div className="content-card-admin">
        <span className="panel-text-sect">Estado: {state}</span>
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
  );
}

function NextSteps({
  election,
  freezeModal,
  closeModal,
  tallyModal,
  combineTallyModal,
  uploadModalonClick,
}) {
  return (
    <div>
      <span className="panel-text-sect">Proximos pasos:</span>
      <Status
        election={election}
        freezeModal={freezeModal}
        closeModal={closeModal}
        tallyModal={tallyModal}
        combineTallyModal={combineTallyModal}
        uploadModalonClick={(value) => {
          uploadModalonClick(value);
        }}
      />
    </div>
  );
}

function CardElection(props) {
  /** @state {num} total election votes */
  const [totalVotes, setTotalVotes] = useState(0);

  /** @state {num} election have audit */
  const [totalVoters, setTotalVoters] = useState(0);

  const [checked, setChecked] = useState(false);

  useEffect(() => {
    getStats(props.election.short_name).then((res) => {
      const { jsonResponse } = res;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
    });
  }, [props.election]);

  const handler = (e) => {
    const checked = e.target.checked;
    props.handlerElectionSelected(checked);
  };

  const inputCheck = () => {
    if (props.electionSelected.length === 0) return false;

    let status = props.election.election_status;
    const canCombineDecryptions =
      props.election.election_status === "Decryptions uploaded" ||
      (props.election.election_status === "Tally computed" &&
        props.election.decryptions_uploaded >=
          Math.floor(props.election.total_trustees / 2) + 1);

    if (canCombineDecryptions) {
      status = "Can combine decryptions";
    }
    if (!(status in props.electionSelected)) return false;
    return props.electionSelected[status].some(
      (e) => e.short_name === props.election.short_name
    );
  };

  useEffect(() => {
    const aux = inputCheck();
    setChecked(aux);
  }, [props.electionSelected, props.election]);

  return (
    <div className="box info-general">
      <input type="checkbox" onChange={handler} checked={checked} />
      <Header
        electionName={props.election.name}
        electionShortName={props.election.short_name}
        configRoute={"/psifos/admin/" + props.election.short_name + "/panel"}
      />
      <hr />
      <MainInfo
        state={electionStatusTranslate[props.election.election_status]}
        totalVoters={totalVoters}
        totalVotes={totalVotes}
      />
      <hr />
      <NextSteps
        election={props.election}
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