import InputRanking from "./Questions/InputRanking";
import { OptionInputRadio } from "./Questions/InputRadio";
import { useEffect, useState } from "react";
import {
  getBlankAnswerId, getNullAnswerId,
} from "../../../../utils";

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
    closed_options,
    include_blank_null,
    max_answers,
  } = question
  const options = Array.from(closed_options.keys());
  const includeInformalAns = include_blank_null === "True";
  const optionIds = includeInformalAns ? options.slice(0, -2) : options;
  const optionLabels = includeInformalAns ? closed_options.slice(0, -2) : closed_options;
  const maxAnswers = parseInt(max_answers, 10)
  
  const [rankedAnswers, setRankedAnswers] = useState([]);
  const [informalAnswer, setInformalAnswer] = useState(undefined);
  const [answers, setAnswers] = useState(rankedAnswers);

  const blankId = getBlankAnswerId(closed_options)
  const nullId = getNullAnswerId(closed_options)

  const padAnswers = (answers) => {
    const desiredLength = maxAnswers; // max_ans >= ans.length
    const currentLength = answers.length;
    if (
      currentLength === 1 && answers[0] === nullId
    ) {
      return Array(desiredLength).fill(nullId)
    }
    else {
      const padSize = desiredLength - currentLength
      return answers.concat(Array(padSize).fill(blankId))
    }
  }

  const [BChangedByA, setBChangedByA] = useState(false)
  const [AChangedByB, setAChangedByB] = useState(false)

  useEffect(() => {
    if (!AChangedByB) {
      setAnswers(rankedAnswers)
      if (informalAnswer) {
        setBChangedByA(true)
        setInformalAnswer(undefined)
      }
    }
    else {
      setAChangedByB(false)
    }
  }, [rankedAnswers]); // a.k.a A

  useEffect(() => {
    if (!BChangedByA) {
      if (rankedAnswers.length === 0) {
        if (informalAnswer){
          setAnswers([informalAnswer])
        }
        else { // es undefined 
          setAnswers(rankedAnswers)
        }
      }
      else {
        setAChangedByB(true)
        setAnswers([informalAnswer])
        setRankedAnswers([])
      }
    }
    else {
      setBChangedByA(false)
    }
  }, [informalAnswer]); // a.k.a B

  useEffect(() => {
    addAnswer(padAnswers(answers), index)
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
          maxAnswers={maxAnswers}
          options={optionIds}
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
            optionIds={[blankId, nullId]}
            optionLabels={closed_options.slice(-2)}
          />
        }
      </div>
    </div>
  );
};

export default RankingSelection;
