import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../../server";
import BarPsifosGraph from "../Graphs/BarPsifosGraph";
import NotAvalaibleMessage from "../../../Booth/components/NotAvalaibleMessage";
import ClassicSelector from "../../../../component/Selectors/classicSelector";

function TimeOptions({ handleDeltaTime, deltaTime }) {
  const options = {
    "1": "1 minuto",
    "30": "30 minutos",
    "60": "1 hora",
    "120": "2 horas",
    "240": "4 horas",
    "1440": "1 Día",
  }
  return (
    <ClassicSelector
      handleChange={handleDeltaTime}
      options={options}
      value={deltaTime}
      selectorName="delta-time"
      selectorLabel="Escala de tiempo:"
    />
  );
}

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

  const getCountDates = useCallback(async () => {
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
  }, [deltaTime, shortName]);

  useEffect(() => {
    getCountDates();
  }, [getCountDates, deltaTime]);

  function handleDeltaTime(event) {
    setDeltaTime(parseInt(event.target.value));
  }

  return (
    <>
      {Object.keys(votesForTime).length !== 0 ? (
        <div className="chart-container" style={{ overflowX: "auto" }}>
          <div className="is-flex is-align-items-center is-flex-direction-column">
            <BarPsifosGraph
              data={votesForTime}
              label="Cantidad de votos"
              title="Votos a traves del tiempo"
              onlyHour={true}
            />
          </div>
          <TimeOptions handleDeltaTime={handleDeltaTime} deltaTime={deltaTime} />
        </div>
      ) : load ? (
        <div className="d-flex is-justify-content-center">
          <NotAvalaibleMessage message="Sin votos registrados" />
        </div>
      ) : (
        <div className="d-flex justify-content-center pt-4">
          <div className="spinner-animation"></div>
        </div>
      )}
    </>
  );
}

export default VotesByTime;
