import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "../../Admin/component/Tabs";
import Participation from "./statistics/participation/participation";
// import RollCharacteristics from "./statistics/rollCharacteristics/rollCharacteristics";
// import VotersCharacteristics from "./statistics/votersCharacteristics/votersCharacteristics";
import VotesByTime from "./statistics/votesByTime/votesByTime";
import { requestElectionPublic } from "./statistics/components/client";
import {
  isOpenLoginElection, isSemiPublicLoginElection,
} from "../../../utils";

const showCompleatStatistic = (loginType) => (
  !isOpenLoginElection(loginType)
  && !isSemiPublicLoginElection(loginType)
)

function StatisticsBooth() {
  const [actualTab, setActualTab] = useState(0);
  const { shortName } = useParams();
  const [election, setElection] = useState(undefined);

  const initComponent = useCallback(() => {
    requestElectionPublic(shortName, setElection)
  }, []);

  useEffect(() => {
    initComponent();
  }, [initComponent]);

  const tabsAndComponents = {
    "Participación": <Participation
      shortName={shortName}
      election={election}
    />,
    // "Caracterización del padrón": <RollCharacteristics
    //   election={election}
    // />,
    // "Caracterización de los votos recibidos": <VotersCharacteristics
    //   election={election}
    // />,
    "Distribución de los votos en el tiempo": <VotesByTime
      shortName={shortName}
      election={election}
    />,
  }

  let tabsNames = Object.keys(tabsAndComponents)
  console.log(election && showCompleatStatistic(election.election_login_type))
  if (election && !showCompleatStatistic(election.election_login_type)) {
    tabsNames = tabsNames.filter((name) => (
      name !== "Caracterización del padrón"
      && name !== "Caracterización de los votos recibidos"
    ))
    console.log('aber')
  }

  return (
    election && <div className="chart-container">
      <Tabs
        actualTab={actualTab}
        setActualTab={setActualTab}
        tabs={tabsNames}
      />
      {tabsAndComponents[tabsNames[actualTab]]}
    </div>
  );
}

export default StatisticsBooth;
