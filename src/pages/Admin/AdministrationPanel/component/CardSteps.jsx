import Status from "./Status";

function CardSteps(props) {
  return (
    <div className="box ">
      <div className="is-size-4">Proximos pasos</div>

      <hr />

      <Status
        uuid={props.uuid}
        electionStatus={props.electionStatus}
        haveVoters={props.haveVoters}
        haveQuestions={props.haveQuestions}
        haveTrustee={props.haveTrustee}
        freezeModal={props.freezeModal}
        closeModal={props.closeModal}
        tallyModal={props.tallyModal}
        combineTallyModal={props.combineTallyModal}
        uploadModalonClick={(value) => {
          props.uploadModalonClick(value);
        }}
      />
    </div>
  );
}

export default CardSteps;
