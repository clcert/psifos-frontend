import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../../server";
import BarPsifosGraph from "../Graphs/BarPsifosGraph";
import NotAvalaibleMessage from "../../../../component/Messages/NotAvailableMessage";
import ClassicSelector from "../../../../component/Selectors/classicSelector";
import Spinner from "../../../../component/OthersComponents/Spinner";
import { requestCountDates } from "../../../Booth/Panel/statistics/components/client";

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
    <div style={{marginTop: '30px'}}>
      <ClassicSelector
        handleChange={handleDeltaTime}
        options={options}
        value={deltaTime}
        selectorName="delta-time"
        selectorLabel="Escala de tiempo:"
      />
    </div>
  );
}

function ShowStatistics({votesForTime}) {
  return (
    <div className="is-flex is-align-items-center is-flex-direction-column">
      <BarPsifosGraph
        data={votesForTime}
        label="Cantidad de votos"
        title="Votos a traves del tiempo"
        onlyHour={true}
      />
    </div>
  )
}

function VotesByTime(props) {
  const [deltaTime, setDeltaTime] = useState(60);
  const [votesForTime, setVotesForTime] = useState({});
  const [load, setLoad] = useState(false);
  const { shortName } = useParams();

  const getCountDates = useCallback(async () => {
    requestCountDates(shortName, deltaTime, setVotesForTime, setLoad)
  }, [deltaTime, shortName]);

  useEffect(() => {
    getCountDates();
  }, [getCountDates, deltaTime]);

  return (
    <>
      {Object.keys(votesForTime).length !== 0 ? (
        <div className="chart-container" style={{ overflowX: "auto" }}>
          <ShowStatistics
            votesForTime={votesForTime}
          />
          <TimeOptions
            handleDeltaTime={(value) => setDeltaTime(parseInt(value))}
            deltaTime={deltaTime}
          />
        </div>
      ) : load ? (
        <div className="d-flex is-justify-content-center">
          <NotAvalaibleMessage message="Sin votos registrados" />
        </div>
      ) : (
        <Spinner />
      )}
    </>
  );
}

export default VotesByTime;
