import InputRanking from "./Questions/InputRanking";
import { OptionInputRadio } from "./Questions/InputRadio";
import { useEffect, useState } from "react";

function InformalInput({
  questionId, ans, ansHandler,
  optionIds, optionLabels,
}) {
  return (
    <div>
      {optionIds.map((key, index) => {
        return (
          <OptionInputRadio
            key={`option-${key}`}
            optionId={key}
            questionId={questionId}
            optionLabel={optionLabels[index]}
            isSelected={ans === key}
            isBordered={true}
            inputHandler={(e) => ansHandler(
              parseInt(e.target.value)
            )}
          />
        )
      })}
    </div>
  )
}

const RankingSelection = ({
  question, addAnswer, index
}) => {
  const {
    closed_options, include_blank_null,
  } = question
  const options = Array.from(closed_options.keys());
  const includeInformalAns = include_blank_null === "True";
  const optionIds = includeInformalAns ? options.slice(0, -2) : options;
  const optionLabels = includeInformalAns ? closed_options.slice(0, -2) : closed_options;
  
  const [rankedAnswers, setRankedAnswers] = useState(optionIds);
  const [informalAnswer, setInformalAnswer] = useState(undefined);
  const [answers, setAnswers] = useState(rankedAnswers);

  useEffect(() => {
    !informalAnswer && setAnswers(rankedAnswers)
  }, [rankedAnswers]);

  useEffect(() => {
    setAnswers(
      informalAnswer ? [informalAnswer] : rankedAnswers
    )
  }, [informalAnswer]);

  useEffect(() => {
    addAnswer(answers, index)
  }, [answers]);

  return (
    <div>
      <div>
        <InputRanking
          answers={rankedAnswers}
          answersHandler={(ans) => setRankedAnswers(
            ans.map((item) => item-1)
          )}
          answerLabels={optionLabels}
          clickHandler={() => (
            answers.length === 1 &&
            answers[0] === informalAnswer
          ) && setInformalAnswer(undefined)}
        />
        {includeInformalAns &&
          <InformalInput
            questionId={index}
            ans={informalAnswer}
            ansHandler={
              (e) => {
                informalAnswer === e ?
                setInformalAnswer(undefined) :
                setInformalAnswer(e)
              }
            }
            optionIds={options.slice(-2)}
            optionLabels={closed_options.slice(-2)}
          />
        }
      </div>
    </div>
  );
};

export default RankingSelection;
