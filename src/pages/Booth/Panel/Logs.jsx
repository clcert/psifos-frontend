import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../server";

const events = {
  trustee_created: "Creación de custodio(a) de clave",
  public_key_uploaded: "Creación de llave pública",
  voter_file_uploaded: "Carga de padrón al sistema",
  voting_started: "Inicio de elección",
  voting_stopped: "Termino de elección",
  tally_computed: "Cálculo de precómputo",
  decryptions_combined: "Combinación de desencriptaciones parciales",
  electoral_roll_modified: "Modificación al padrón"
};

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

  function generateText(logs) {
    let ret = "Evento: ";
    ret += events[logs.event];
    // let event_text = events[logs.event];
    if (
      logs.event === "trustee_created" ||
      logs.event === "public_key_uploaded"
    ) {
      const event_params = JSON.parse(logs.event_params);
      ret += "Custodio(a): " + event_params.trustee_login_id;
      // event_text = event_text.concat(" ", event_params.trustee_login_id);
    }
    // return event_text;
    return ret;
  }

  return (
    <>
      {load ? (
        <>
          {electionLogs.map((logs, index) => {
            return (
              <div key={index} className="box logs-box">
                <div className="is-size-5">
                  <span>Hora: [{logs.created_at}]</span><br/>
                  <span>Evento: {events[logs.event]}</span><br/>
                  {JSON.stringify(JSON.parse(logs.event_params)) !== "{}" && <span>Info: {JSON.parse(logs.event_params).name}</span>}
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
