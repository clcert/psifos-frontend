import InputRanking from "./Questions/InputRanking";
import { useEffect, useState } from "react";

const RankingSelection = (props) => {
  /**
   * answers initial state is an array with option indices.
   */
  const [answers, setAnswers] = useState(Array.from(props.question.closed_options.keys()));

  useEffect(() => {
    props.addAnswer(answers, props.index)
  }, [answers]);

  return (
    <div>
      <div>
        <InputRanking
          index={props.index}
          election={props.election}
          question={props.question}
          answers={answers}
          setAnswers={setAnswers}
          value={String(props.index)}
        />
      </div>
    </div>
  );
};

export default RankingSelection;
