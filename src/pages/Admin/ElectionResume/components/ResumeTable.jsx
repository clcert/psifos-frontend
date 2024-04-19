import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStats, getStatsGroup } from "../../../../services/election";
import { getPercentage } from "../../utils";
import SimpleHorizontalTable from "../../../../component/Tables/HorizontalTable";

export default function ResumeTable({ grouped = false, group = "" }) {
  /** @state {int} number of voters in the election  */
  const [totalVoters, setTotalVoters] = useState(0);

  /** @state {int} number of votes in the election  */
  const [totalVotes, setTotalVotes] = useState(0);

  /** @urlParam {string} uuid of election */
  const { shortName } = useParams();

  const initComponent = useCallback(() => {
    if (!grouped) {
      getStats(shortName).then((data) => {
        const { jsonResponse } = data;
        setTotalVoters(jsonResponse.total_voters);
        setTotalVotes(jsonResponse.num_casted_votes);
      });
    } else {
      getStatsGroup(shortName, group).then((data) => {
        const { jsonResponse } = data;
        setTotalVoters(jsonResponse.total_voters);
        setTotalVotes(jsonResponse.num_casted_votes);
      });
    }
  }, [group, grouped, shortName]);

  useEffect(() => {
    initComponent();
  }, [initComponent]);

  const contentPerRow = [
    {
      header: "Votos recibidos",
      value: totalVotes,
    }, {
      header: "Total padrón",
      value: totalVoters,
    }, {
      header: "Participación",
      value: getPercentage(totalVotes, totalVoters),
    },
  ]

  return (
    <div className="d-flex disable-text-selection row justify-content-md-center">
      <SimpleHorizontalTable contentPerRow={contentPerRow} />
    </div>
  );
}
