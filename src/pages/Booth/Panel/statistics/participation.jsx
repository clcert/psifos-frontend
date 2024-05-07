import { useCallback, useEffect, useState } from "react";
import Statistic from "./statistic"
import SimpleHorizontalTable, {renderTableData} from "../../../../component/Tables/HorizontalTable";
import { requestStats, requestElectionPublic } from "./client";
import { isSettingUpElection, isOpenLoginElection, roundNumber } from "../../../../utils";
import Spinner from "../../../../component/OthersComponents/Spinner";
import NotAvailableMessage from "../../../../component/Messages/NotAvailableMessage";

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

function ParticipationStats({
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

export default function Participation({ shortName }) {
  const [totalVoters, setTotalVoters] = useState(undefined);
  const [totalVotes, setTotalVotes] = useState(undefined);
  const [election, setElection] = useState(undefined);

  const initComponent = useCallback(() => {
    requestStats(shortName, setTotalVoters, setTotalVotes)
    requestElectionPublic(shortName, setElection)  
  }, []);

  useEffect(() => {
    initComponent();
  }, [initComponent]);

  return(
    election ?
      (!isSettingUpElection(election.election_status) ? (
        totalVoters && totalVotes ? <ParticipationStats
          questions={election.questions}
          totalVotes={totalVotes}
          totalVoters={totalVoters}
          loginType={election.election_login_type}
        /> : <Spinner />
      ) : <div style={{display: "flex", justifyContent: "center"}}>
        <NotAvailableMessage
          message="La elección aun no comienza"
        />
      </div>
    ) : <Spinner />
  )
}