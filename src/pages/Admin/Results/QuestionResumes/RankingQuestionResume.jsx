import { ResumeTables } from "./RankingQuestion/RankingQuestionTables";
import { RoundsCharts } from "./RankingQuestion/RankingQuestionPerRound";

const parseResult = (
  candidates, candidatesNames, roundResumes, talliesResumes
) => {
  let hopefulCandidates = candidates
  return roundResumes.reduce((result, round, index) => {
    hopefulCandidates = hopefulCandidates.map((candidate) => String(candidate))
    const roundTallies = talliesResumes[index]
    const keys = hopefulCandidates.map(candidate => (
      candidatesNames[candidate]
    ))
    const values = hopefulCandidates.map(candidate => (
      Object.keys(roundTallies).includes(candidate)
        ? parseInt(roundTallies[candidate], 10)
        : 0
    ))
    hopefulCandidates = round.hopeful
    return {
      keysPerRound: [...result.keysPerRound, keys],
      valuesPerRound: [...result.valuesPerRound, values],
    };
  }, { keysPerRound: [], valuesPerRound: [] });
};



export default function RankingQuestionResume({ result, question }) {
  const ncandidates = question.include_informal_options ? question.formal_options.length - 2 : question.formal_options.length;
  const candidatesNames = question.include_informal_options ? question.formal_options.slice(0, -2) : question.formal_options;
  const candidates = Array.from(
    { length: ncandidates},
    (_, index) => index
  )
  result["ncandidates"] = ncandidates;
  const {
    quota,
    roundresumes: roundResumes,
    talliesresumes: talliesResumes,
  } = result
  const chartsData = parseResult(candidates, candidatesNames, roundResumes, talliesResumes)

  return (
    <div style={{ marginTop: "1rem" }} className="is-size-6">
      <ResumeTables
        {...result}
        includeInformals={question.include_informal_options}
      />
      <RoundsCharts
        {...chartsData}
        quota={quota}
      />
    </div>
  );
}