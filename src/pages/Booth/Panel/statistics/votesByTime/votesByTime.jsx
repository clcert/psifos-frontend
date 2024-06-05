import { useCallback, useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { requestCountDates } from "../components/client";
import ShowStatistics from "../components/showStatistics";
import VotesByTimeStats from "./votesByTimeStats";
import { isSettingUpElection } from "../../../../../utils";

export default function VotesByTime({election}) {
    const [deltaTime, setDeltaTime] = useState(60);
    const [votesForTime, setVotesForTime] = useState({});
    const { shortName } = useParams();

    const getCountDates = useCallback(async () => {
        requestCountDates(shortName, deltaTime, setVotesForTime)
    }, [deltaTime, shortName]);

    useEffect(() => {
        getCountDates();
    }, [getCountDates, deltaTime]);

    const isSettingUp = election && isSettingUpElection(election.election_status)
    return (
        <ShowStatistics
            notAvailableMessage="La elección aun no comienza"
            showNotAvailableMessage={isSettingUp}
            isLoadData={Boolean(election && votesForTime)}
            statisticsComponent={<VotesByTimeStats
                deltaTime={deltaTime}
                handleDeltaTime={setDeltaTime}
                votesForTime={votesForTime}
            />}
        />
    )
}
