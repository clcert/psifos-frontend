import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../server";

const events = {
  trustee_created: "Custodio creado",
  public_key_uploaded: "Llaves publicas subidas",
  voter_file_uploaded: "Archivo de votantes subido",
  voting_started: "Votación iniciada",
  voting_stopped: "Votación finalizada",
  tally_computed: "Tally computado",
  decryptions_combined: "Desencriptaciones combinadas",
  electoral_roll_modified: "Se modifico el padrón"
};

function Logs() {
  const [electionLogs, setElectionLogs] = useState([]);
  const [load, setLoad] = useState(false);
  const { uuid } = useParams();
  async function getLogs() {
    const resp = await fetch(
      backendInfoIp + "/election/" + uuid + "/election-logs",
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

  function generateText(logs) {
    let event_text = events[logs.event];
    if (
      logs.event === "trustee_created" ||
      logs.event === "public_key_uploaded"
    ) {
      const event_params = JSON.parse(logs.event_params);
      event_text = event_text.concat(" ", event_params.trustee_login_id);
    }
    return event_text;
  }

  return (
    <>
      {load ? (
        <>
          {electionLogs.map((logs, index) => {
            return (
              <div key={index} className="box logs-box">
                <div className="is-size-5">
                  <span>[{logs.created_at}]</span>{" "}
                  <span>{generateText(logs)}</span>
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
