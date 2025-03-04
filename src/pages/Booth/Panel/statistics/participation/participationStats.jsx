import {
  roundNumber,
  isOpenLoginElection, isSemiPublicLoginElection,
} from "../../../../../utils";
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
          "Votaron": totalVotes,
          "No han votado": totalVoters-totalVotes,
        }}
        tableData={{
          "Votos recibidos": totalVotes,
          "Personas en padrón": totalVoters,
          "Participación": `${roundNumber(participation, 2)}%`,
        }}
      />
  )
}

function ResumedStats({ totalVotes, loginType }) {
  return (
    <div>
      {isOpenLoginElection(loginType) && <div className="participation-without-poll">
        Esta elección tiene padrón abierto, por lo que cualquier persona puede votar.
      </div>}
      {isSemiPublicLoginElection(loginType) && <div className="participation-without-poll">
        Esta elección tiene padrón semi abierto, por lo que cualquier persona con cuenta USACH puede votar.
      </div>}
      <SimpleHorizontalTable
        contentPerRow={renderTableData({"Votos recibidos": totalVotes})}
      />
    </div>
  )
}

export default function ParticipationStats({
  loginType, ...props
}) {
  const showCompleatStatistic = (
    !isOpenLoginElection(loginType)
    && !isSemiPublicLoginElection(loginType)
  )
  return (
    <div>
      {showCompleatStatistic ? <FullStats
        {...props}
      /> : <ResumedStats
        loginType={loginType}
        {...props}
      />}
    </div>
  )
}