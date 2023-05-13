import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { backendOpIP } from "../../../../server";
import LinePsifosGraph from "../Graphs/LinePsifosGraph";

function InvalidLogginByTime(props) {
  /** Section dedicated to graphing the number of voter invalid logging by time */

  /** @state {number} delta time for count votes */
  const [deltaTime, setDeltaTime] = useState(60);

  /** @state {json} count voter invalid logging of election */
  const [logginFailForTime, setLogginFailForTime] = useState({});

  /** @state {json} count voter invalid logging of election */
  const [logginInvalidTotal, setLogginInvalidTotal] = useState(0);

  /** @state {bool} load state fetch */
  const [load, setLoad] = useState(false);

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  async function getCountDates() {
    const token = sessionStorage.getItem("token");
    const resp = await fetch(backendOpIP + "/" + shortName + "/count-logs", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        minutes: deltaTime,
        type_log: "voter_login_fail",
      }),
    });
    if (resp.status === 200) {
      const jsonResponse = await resp.json();
      if (Object.keys(jsonResponse).length !== 0) {
        setLogginFailForTime(jsonResponse.count_logs);
        setLogginInvalidTotal(jsonResponse.total_logs);
      }
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
      {Object.keys(logginFailForTime).length !== 0 ? (
        <div className="chart-container" style={{ overflowX: "auto" }}>
          <span className="is-size-5">Variación de tiempo</span>
          <span className="is-size-5 ml-5">Total: {logginInvalidTotal}</span>
          <div className="control">
            <div className="select">
              <select
                onChange={handleChange}
                name="delta-time"
                id="time"
                value={deltaTime}
              >
                <option value="30">30 Minutos</option>
                <option value="60">60 Minutos</option>
                <option value="120">2 Horas</option>
                <option value="240">4 Horas</option>
                <option value="1440">1 Día</option>
              </select>
            </div>
          </div>

          <div className="is-flex is-align-items-center is-flex-direction-column">
            <LinePsifosGraph
              data={logginFailForTime}
              label="Ingresos fallidos"
            />
          </div>
        </div>
      ) : load ? (
        <div className="box" id="not-results-box">
          <p className="is-size-3 has-text-weight-bold">
            Aun no existen ingresos registrados
          </p>
        </div>
      ) : (
        <div className="d-flex justify-content-center pt-4">
          <div className="spinner-animation"></div>
        </div>
      )}
    </>
  );
}

export default InvalidLogginByTime;
