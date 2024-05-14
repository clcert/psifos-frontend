import { isOpenLoginElection, roundNumber } from "../../../../../utils";
import Statistic from "../components/statistic"
import SimpleHorizontalTable, {renderTableData} from "../../../../../component/Tables/HorizontalTable";

function FullStats({
  totalVotes, totalVoters,
}) {
  const participation = totalVotes/totalVoters*100
  return (
    <Statistic
        title="Participantes en el padrón"
        pieChartData={{
          "Votan": totalVotes,
          "Se abstienen": totalVoters-totalVotes,
        }}
        tableData={{
          "Votos recibidos": totalVotes,
          "Personas en padrón": totalVoters,
          "Participación": `${roundNumber(participation, 2)}%`,
        }}
      />
  )
}

function ResumedStats({ totalVotes }) {
  return (
    <SimpleHorizontalTable
      contentPerRow={renderTableData({"Votos recibidos": totalVotes})}
    />
  )
}

export default function ParticipationStats({
  loginType, ...props
}) {
  const showCompleatStatistic = !isOpenLoginElection(loginType)
  return (
    <div>
      {showCompleatStatistic ? <FullStats
        {...props}
      /> : <ResumedStats
        {...props}
      />}
    </div>
  )
}