import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Tabs from "../../Admin/component/Tabs";
import Participation from "./statistics/participation/participation";
import RollCharacteristics from "./statistics/rollCharacteristics/rollCharacteristics";
import VotersCharacteristics from "./statistics/votersCharacteristics/votersCharacteristics";
import VotesByTime from "./statistics/votesByTime/votesByTime";
import Weights from "./statistics/weights/weights";
import { requestElectionPublic } from "./statistics/components/client";
import {
  isOpenLoginElection, isSemiPublicLoginElection,
  filterObj,
} from "../../../utils";

const getTabs = (election, shortName) => {
  return {
    "Participación": {
      component: <Participation
        shortName={shortName}
        election={election}
      />,

    },
    // "Caracterización del padrón": {
    //   component: <RollCharacteristics
    //     election={election}
    //   />,
    //   hideWhenNoPoll: true,
    //   hideWhenUngrouped: true,
    // },
    // "Caracterización de los votos recibidos": {
    //   component: <VotersCharacteristics
    //     election={election}
    //   />,
    //   hideWhenNoPoll: true,
    //   hideWhenUngrouped: true,
    // },
    // "Ponderaciones": {
    //   component: <Weights
    //     election={election}
    //   />,
    //   hideWhenNoPoll: true,
    //   hideWhenGrouped: true,
    // },
    "Distribución de los votos en el tiempo": {
      component: <VotesByTime
        shortName={shortName}
        election={election}
      />,
    },
  }
}

const getFilteredTabs = (tabs, loginType, grouped) => {
  if (isOpenLoginElection(loginType)
    || isSemiPublicLoginElection(loginType)) {
      return filterObj(tabs, (_, value) => !value.hideWhenNoPoll)
  }
  else if(grouped) {
    return filterObj(tabs, (_, value) => !value.hideWhenGrouped)
  }
  return filterObj(tabs, (_, value) => !value.hideWhenUngrouped)
}

function StatisticSections({ election, shortName }) {
  const [actualTab, setActualTab] = useState(0);
  const {
    election_login_type: loginType, grouped
  } = election
  const tabs = getTabs(election, shortName)
  const filteredTabs = getFilteredTabs(tabs, loginType, grouped)
  const tabNames = Object.keys(filteredTabs)
  return (
    <div className="chart-container">
      <Tabs
        actualTab={actualTab}
        setActualTab={setActualTab}
        tabs={tabNames}
      />
      {filteredTabs[tabNames[actualTab]].component}
    </div>
  );
}

function StatisticsBooth() {
  const [election, setElection] = useState(undefined);
  const { shortName } = useParams();
  const initComponent = useCallback(() => {
    requestElectionPublic(shortName, setElection)
  }, []);
  
  useEffect(() => {
    initComponent();
  }, [initComponent]);
  
  return (
    election && <StatisticSections
      election={election}
      shortName={shortName}
    />
  )
}

export default StatisticsBooth;
