import BarPsifosGraph from "../../../../Admin/Statistics/Graphs/BarPsifosGraph";
import ClassicSelector from "../../../../../component/Selectors/classicSelector";


function TimeSelector({ handleDeltaTime, deltaTime }) {
  const options = {
    "1": "1 minuto",
    "30": "30 minutos",
    "60": "1 hora",
    "120": "2 horas",
    "240": "4 horas",
    "1440": "1 Día",
  }
  return (
    <div style={{marginTop: '30px'}}>
      <ClassicSelector
        handleChange={handleDeltaTime}
        options={options}
        value={deltaTime}
        selectorName="delta-time"
        selectorLabel="Escala de tiempo:"
      />
    </div>
  );
}

function TimeStats({ votesForTime }) {
  return (
    <div className="is-flex is-align-items-center is-flex-direction-column">
      <BarPsifosGraph
        data={votesForTime}
        label="Cantidad de votos"
        title="Votos a traves del tiempo"
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
        <TimeStats
            votesForTime={votesForTime}
        />
        <TimeSelector
            handleDeltaTime={(value) => handleDeltaTime(parseInt(value))}
            deltaTime={deltaTime}
        />
    </div>
  );
}