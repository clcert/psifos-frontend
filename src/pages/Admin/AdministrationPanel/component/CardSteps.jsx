import Status from "./Status";

function CardSteps({
  election,
  electionStep,
  freezeModal,
  closeModal,
  tallyModal,
  combineTallyModal,
  uploadModalonClick,
}) {
  return (
    <div className="box ">
      <div className="is-size-4">Proximos pasos</div>

      <hr />

      <Status
        election={election}
        electionStep={electionStep}
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

export default CardSteps;
