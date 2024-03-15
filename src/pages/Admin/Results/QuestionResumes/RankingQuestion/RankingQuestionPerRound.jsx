import Tabs from "../../../component/Tabs"
import BarChart from "../../../component/BarChart"
import { useState } from "react"

function RoundChart({
    actualTab, roundKeys, index, values, quota,
}) {
    const visualMapRankingChart = {
      orient: 'horizontal',
      left: 'center',
      text: ['Mayor puntaje', 'Menor puntaje'],
      dimension: 0,
      inRange: {
          color: ['#0E4B90', '#068FCF', '#39D0FF']
      }
    }
    return (
      <div
        className={
          actualTab !== index ? "d-none" : "ranking-illustration-container"
        }
        key={`round-${index}`}
      >
        <BarChart
          className={`chart-round-${index}`}
          keys={roundKeys}
          values={values}
          title={`Puntaje obtenido por cada candidato en la ronda ${index+1}`}
          visualMap={visualMapRankingChart}
          markLine={{ name: 'quota', xAxis: quota }}
          valueMeaning="Puntaje"
        />
      </div>
    )
}

export function RoundsCharts({
    keysPerRound, valuesPerRound, quota,
}) {
    const [actualTab, setActualTab] = useState(0)
    const tabs = Array.from(
      {length: keysPerRound.length}, (_, index) => `Ronda ${index+1}`
    )

    return (
      <div className="ranking-result-tabs">
        <Tabs
          actualTab={actualTab}
          setActualTab={setActualTab}
          tabs={tabs}
        />
        {keysPerRound.map((roundKeys, index) => (
          <RoundChart
            values={valuesPerRound[index]}
            actualTab={actualTab}
            roundKeys={roundKeys}
            index={index}
            quota={quota}
          />
        ))}
      </div>
    )
}