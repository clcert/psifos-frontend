import ResumeElection from "./ResumeElection";
import ResumeWeights from "./ResumeWeights";
import ResultsPerQuestion from "./ResultsPerQuestion";

function StyledBox({ children }) {
  return (
    <div className="box " style={{ width: "100%" }}>
      {children}
    </div>
  );
}

function SelectGroup({ groups, setGroup }) {
  const handleChange = (e) => {
    setGroup(e.target.value);
  };
  return (
    <>
      <span className="mr-2">Selecciona el grupo:</span>
      <div className="control d-inline-flex">
        <div className="select">
          <select onChange={handleChange}>
            {groups.map((group) => {
              return (
                <option key={group} value={group}>
                  {group}
                </option>
              );
            })}
          </select>
        </div>
      </div>
    </>
  );
}

export default function CalculatedResults({
  questions,
  results,
  election,
  groups,
  setGroup,
}) {
  return (
    <>
      <StyledBox>
        <ResumeElection />
      </StyledBox>
      {election.max_weight !== 1 && (
        <StyledBox>
          <ResumeWeights />
        </StyledBox>
      )}
      {election.grouped && (
        <StyledBox>
          <SelectGroup groups={groups} setGroup={setGroup} />
        </StyledBox>
      )}
      <StyledBox>
        <ResultsPerQuestion
          election={election}
          questions={questions}
          results={results}
        />
      </StyledBox>
    </>
  );
}
