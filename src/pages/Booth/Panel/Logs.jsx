import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../server";
import { Tooltip } from 'react-tooltip'
import { events } from '../../../constants'

function MoreInfo({children, descript}) {
  return (
    <>
      <div
        data-tooltip-id="my-tooltip" 
        className="more-info-tooltip"
        data-tooltip-content={descript}
      >
        {children}
      </div>
      <Tooltip id="my-tooltip" place="bottom"/>
    </>
  )
}

function EventHeader({event, descript}) {
  return (
    <div className="is-flex level event-header">
      <div className="title">
        <i className="fa-solid fa-check check-icon"/> {event} <br/>
      </div>
      <MoreInfo descript={descript}>
        <i className="fa-solid fa-circle-info more-info-icon"/>
      </MoreInfo>
    </div>
  )
}

function EventInfo({created_at, event_params, event_detail}) {
  return (
    <div className="event-info">
      <span> {created_at}</span><br/>
      {(
          JSON.stringify(event_params) !== "{}" && event_params.name
        ) && <span>
          {event_detail}
          {event_params.name}
        </span>}
    </div>
  )
}

function Logs() {
  const [electionLogs, setElectionLogs] = useState([]);
  const [load, setLoad] = useState(false);
  const { shortName } = useParams();
  async function getLogs() {
    const resp = await fetch(
      backendInfoIp + "/election/" + shortName + "/election-logs",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (resp.status === 200) {
      const jsonResponse = await resp.json();
      setElectionLogs(jsonResponse);
      setLoad(true);
    }
  }

  useEffect(() => {
    getLogs();
    const interval = setInterval(() => {
      getLogs();
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, []);


  return (
    <>
      {load ? (
        <>
          {electionLogs.map((logs, index) => {
            return (
              <div key={index} className="box logs-box">
                <div className="is-size-5">
                  <EventHeader
                    event={events[logs.event].name}
                    descript={events[logs.event].descript}
                  />
                  <hr/>
                  <EventInfo
                    created_at={new Date(logs.created_at).toLocaleString()}
                    event_params={JSON.parse(logs.event_params)}
                    event_detail={events[logs.event].detail}
                  />
                </div>
              </div>
            );
          })}
        </>
      ) : (
        <div className="spinner-animation"></div>
      )}
    </>
  );
}

export default Logs;
