import InputRanking from "./Questions/InputRanking";

const RankingSelection = (props) => {
  const [answers, setAnswers] = useState([]);
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
