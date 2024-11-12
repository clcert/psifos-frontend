import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getStats,
  getStatsGroup,
  getEvents,
} from "../../../../services/election";
import { getPercentage } from "../../utils";
import SimpleHorizontalTable from "../../../../component/Tables/HorizontalTable";

export default function ResumeTable({ grouped = false, group = "" }) {
  /** @state {int} number of voters in the election  */
  const [totalVoters, setTotalVoters] = useState(0);

  /** @state {int} number of votes in the election  */
  const [totalVotes, setTotalVotes] = useState(0);

  const [startTime, setStartTime] = useState("");
  const [closeTime, setCloseTime] = useState("");

  const [load, setLoad] = useState(false);

  /** @urlParam {string} uuid of election */
  const { shortName } = useParams();

  const initComponent = useCallback(() => {
    setLoad(false);
    if (!grouped) {
      getStats(shortName).then((data) => {
        const { jsonResponse } = data;
        setTotalVoters(jsonResponse.total_voters);
        setTotalVotes(jsonResponse.num_casted_votes);
        setLoad(true);
      });
    } else {
      getStatsGroup(shortName, group).then((data) => {
        const { jsonResponse } = data;
        setTotalVoters(jsonResponse.total_voters);
        setTotalVotes(jsonResponse.num_casted_votes);
        setLoad(true);
      });
    }
    getEvents(shortName).then((data) => {
      for (const event of data.jsonResponse) {
        if (event.event === "voting_started") {
          setStartTime(event.created_at);
        }
        if (event.event === "voting_stopped") {
          setCloseTime(event.created_at);
        }
      }
    });
  }, [group, grouped, shortName]);

  useEffect(() => {
    initComponent();
  }, [initComponent]);

  const contentPerRow = [
    {
      header: "Votos recibidos",
      value: totalVotes,
    },
    {
      header: "Total padrón",
      value: totalVoters,
    },
    {
      header: "Participación",
      value: getPercentage(totalVotes, totalVoters),
    },
  ];

  var options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  };

  const contentPerRowTimes = [
    {
      header: "Hora de Apertura",
      value: new Date(startTime).toLocaleDateString("es-CL", options),
    },
    {
      header: "Hora de Cierre",
      value: new Date(closeTime).toLocaleDateString("es-CL", options),
    },
  ];

  return (
    <div>
      {!load && (
        <div className="d-flex align-content-center justify-content-center">
          <div className="spinner-animation"></div>
        </div>
      )}
      {load && (
        <>
          <div className="d-flex disable-text-selection row justify-content-md-center">
            <SimpleHorizontalTable contentPerRow={contentPerRowTimes} />
          </div>
          <div className="d-flex disable-text-selection row justify-content-md-center">
            <SimpleHorizontalTable contentPerRow={contentPerRow} />
          </div>
        </>
      )}
    </div>
  );
}
