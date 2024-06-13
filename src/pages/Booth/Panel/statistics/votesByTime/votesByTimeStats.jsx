import BarPsifosGraph from "../../../../Admin/Statistics/Graphs/BarPsifosGraph";
import ClassicSelector from "../../../../../component/Selectors/classicSelector";
import { deltaTimeOptions, parseDateTimeStr } from "./utils";

function TimeSelector({ handleDeltaTime, deltaTime }) {
  return (
    <div style={{marginTop: '30px'}}>
      <ClassicSelector
        handleChange={handleDeltaTime}
        options={deltaTimeOptions}
        value={deltaTime}
        selectorName="delta-time"
        selectorLabel="Escala de tiempo:"
      />
    </div>
  );
}

function TimeStats({ votesForTime }) {
  const { accVotesForTime } = Object.keys(votesForTime).reduce(({acc, accVotesForTime}, currentTime) => {
    const currentVotes = acc + votesForTime[currentTime]
    return {
      acc: currentVotes,
      accVotesForTime: {
        ...accVotesForTime,
        [currentTime]: currentVotes
      }
    }
  }, {
    acc: 0,
    accVotesForTime: {}
  })

  return (
    <div className="is-flex is-align-items-center is-flex-direction-column">
      <BarPsifosGraph
        data={votesForTime}
        label="Cantidad de votos"
        title="Ingreso de votos en el tiempo"
        onlyHour={true}
      />
      <BarPsifosGraph
        data={accVotesForTime}
        label="Cantidad de votos"
        title="Votos acumulados en el tiempo"
        onlyHour={true}
      />
    </div>
  )
}

export default function VotesByTimeStats({
    votesForTime, handleDeltaTime, deltaTime,
}) {
  return (
    <div className="chart-container" style={{ overflowX: "auto" }}>
        <TimeSelector
            handleDeltaTime={(value) => handleDeltaTime(parseInt(value))}
            deltaTime={deltaTime}
        />
        <TimeStats
            votesForTime={Object.keys(votesForTime).reduce((acc, key) => {
              return {
                ...acc,
                [parseDateTimeStr(key, deltaTime)]: votesForTime[key]
              }
          }, {})}
        />
    </div>
  );
}