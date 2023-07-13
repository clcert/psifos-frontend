import ResumeElection from "./ResumeElection";
import ResumeWeights from "./ResumeWeights";
import ResultsPerQuestion from "./ResultsPerQuestion";

function StyledBox({children}) {
  return (
    <div className="box " style={{width: "100%"}}>
      {children}
    </div>
  )
}

export default function CalculatedResults({ questions, results, election }) {
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