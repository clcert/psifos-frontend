import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import LinePsifosGraph from "../Graphs/LinePsifosGraph";
import { getCountLogs } from "../../../../services/election";
import { useError } from "../../../General/ErrorPage";

function LogginByTime(props) {
  /** Section dedicated to graphing the number of voter logging by time */

  /** @state {number} delta time for count votes */
  const [deltaTime, setDeltaTime] = useState(60);

  /** @state {json} count voter logging of election */
  const [logginForTime, setLogginForTime] = useState({});

  /** @state {json} count voter logging of election */
  const [totalLoggin, setTotalLoggin] = useState(0);

  /** @state {bool} load state fetch */
  const [load, setLoad] = useState(false);

  /** @urlParam {string} uuid of election */
  const { shortName } = useParams();
  
  /** @state {function} function to show error */
  const { setHasError } = useError();

  const getCountDates = useCallback(async () => {
    try {
      const response = await getCountLogs(shortName, deltaTime, "voter_login");
      const { jsonResponse } = response;
      if (Object.keys(jsonResponse).length !== 0) {
        setLogginForTime(jsonResponse.count_logs);
        setTotalLoggin(jsonResponse.total_logs);
      }
      setLoad(true);
    }
    catch (error) {
      setHasError(true);
    }
  }, [deltaTime, shortName]);

  useEffect(() => {
    getCountDates();
  }, [getCountDates, deltaTime]);

  function handleChange(event) {
    setDeltaTime(parseInt(event.target.value));
  }

  return (
    <>
      {Object.keys(logginForTime).length !== 0 ? (
        <div className="chart-container" style={{ overflowX: "auto" }}>
          <span className="is-size-5">Variación de tiempo</span>
          <span className="is-size-5 ml-5">Total: {totalLoggin}</span>
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
            <LinePsifosGraph data={logginForTime} label="Ingresos validos" />
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

export default LogginByTime;
