import InputRanking from "./Questions/InputRanking";
import { useState } from "react";

const RankingSelection = (props) => {
  /**
   * answers initial state is an array with option indices.
   */
  const [answers, setAnswers] = useState(Array.from(props.question.closed_options.keys()));
  return (
    <div>
      <div>
        <InputRanking
          index={props.index}
          election={props.election}
          question={props.question}
          answers={answers}
          setAnswers={setAnswers}
          addAnswer={props.addAnswer}
          value={String(props.index)}
        />
      </div>
    </div>
  );
};

export default RankingSelection;
