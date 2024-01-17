import { useState } from "react";
import Tabs from "../../Admin/component/Tabs";
import VotesByTime from "../../Admin/Statistics/Sections/VotesByTime";
import CardsInfoElection from "./components/CardsInfoElection";

function StatisticsBooth() {
  const [actualTab, setActualTab] = useState(0);

  const tabs = ["Votos recibidos", "Votos en el tiempo"];

  return (
    <div className="chart-container">
      <Tabs actualTab={actualTab} setActualTab={setActualTab} tabs={tabs} />
      <div className={actualTab !== 0 ? "d-none" : ""}>
        <CardsInfoElection />
      </div>
      <div className={actualTab !== 1 ? "d-none" : ""}>
        <VotesByTime />
      </div>
    </div>
  );
}

export default StatisticsBooth;
