import { useCallback, useEffect, useState } from "react";
import Statistic from "./statistic"
import SimpleHorizontalTable, {renderTableData} from "../../../../component/Tables/HorizontalTable";
import { requestStats, requestElectionPublic } from "./client";
import { isSettingUpElection, isOpenLoginElection } from "../../../../utils";
import Spinner from "../../../../component/OthersComponents/Spinner";
import NotAvailableMessage from "../../../../component/Messages/NotAvailableMessage";

function FullStats({
  totalVotes, totalVoters,
}) {
  return (
    <Statistic
        title="Participantes en el padrón"
        pieChartData={{
          "Votan": totalVotes,
          "Se abstienen": totalVoters-totalVotes,
        }}
        tableData={{
          "Votos recibidos": totalVotes,
          "Total padrón": totalVoters,
          "Participación": `${totalVotes/totalVoters*100}%`,
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
      ) : <NotAvailableMessage
        message="La elección aun no comienza."
      />
    ) : <Spinner />
  )
}