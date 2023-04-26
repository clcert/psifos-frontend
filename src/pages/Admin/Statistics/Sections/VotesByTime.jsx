import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../../server";
import LinePsifosGraph from "../Graphs/LinePsifosGraph";

function VotesByTime(props) {
  /** Section dedicated to graphing the number of votes by time */

  /** @state {number} delta time for count votes */
  const [deltaTime, setDeltaTime] = useState(60);

  /** @state {json} count votes of election */
  const [votesForTime, setVotesForTime] = useState({});

  /** @state {bool} load state fetch */
  const [load, setLoad] = useState(false);

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  async function getCountDates() {
    const resp = await fetch(backendInfoIp + "/" + shortName + "/count-dates", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        minutes: deltaTime,
      }),
    });
    if (resp.status === 200) {
      const jsonResponse = await resp.json();
      setVotesForTime(jsonResponse);
      setLoad(true);
    }
  }

  useEffect(() => {
    getCountDates();
  }, [deltaTime]);

  function handleChange(event) {
    setDeltaTime(parseInt(event.target.value));
  }

  return (
    <>
      {Object.keys(votesForTime).length !== 0 ? (
        <div className="chart-container" style={{ overflowX: "auto" }}>
          <label>Variación de tiempo:</label>
          <div className="control">
            <div className="select">
              <select
                onChange={handleChange}
                name="delta-time"
                id="time"
                value={deltaTime}
              >
                <option value="1">1 Minuto</option>
                <option value="30">30 Minutos</option>
                <option value="60">60 Minutos</option>
                <option value="120">2 Horas</option>
                <option value="240">4 Horas</option>
                <option value="1440">1 Día</option>
              </select>
            </div>
          </div>
          <div className="is-flex is-align-items-center is-flex-direction-column">
            <LinePsifosGraph data={votesForTime} label="Cantidad de votos" />
          </div>
        </div>
      ) : load ? (
        <div className="box" id="not-results-box">
          <p className="is-size-3 has-text-weight-bold">
            Aun no existen votos registrados
          </p>
        </div>
      ) : (
        <div className="spinner-animation d-flex justify-content-center"></div>
      )}
    </>
  );
}

export default VotesByTime;
