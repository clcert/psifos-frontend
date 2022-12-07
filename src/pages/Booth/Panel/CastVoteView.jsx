import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bulma-components";
import { useParams, useSearchParams } from "react-router-dom";
import { backendInfoIp } from "../../../server";
import { getElectionInfo, getVotesInfo } from "../../../services/info";
import UrnaTable from "./components/UrnaTable";

function CastVoteView() {
  const [electionData, setElectionData] = useState({
    election: {},
    electionVoters: [],
    actualPage: 0,
  });
  const [loadData, setLoadData] = useState(false);
  const [lengthPage] = useState(50);
  const [searchParams] = useSearchParams();
  const { uuid } = useParams();

  const hashUrl =
    searchParams.get("hash") !== null ? searchParams.get("hash") : undefined;

  useEffect(() => {
    getVotesInfo(
      uuid,
      electionData.actualPage * lengthPage,
      lengthPage,
      hashUrl
    ).then((dataVotes) => {
      getElectionInfo(uuid).then((dataElection) => {
        setElectionData({
          ...electionData,
          election: dataElection,
          electionVoters: dataVotes.voters,
          actualPage: Math.floor(dataVotes.position / lengthPage),
        });
        setLoadData(true);
      });
    });
  }, []);

  function changePage(number) {
    /**
     * Change the page getting the corresponding votes
     */

    const newPage = electionData.actualPage + number;
    if (newPage >= 0) {
      (uuid, newPage * lengthPage, lengthPage, "").then((dataVotes) => {
        if (dataVotes.cast_vote.length !== 0) {
          setElectionData({
            ...electionData,
            electionVoters: dataVotes.voters,
            actualPage: newPage,
          });
        }
      });
    }
  }

  return (
    <>
      {loadData ? (
        <>
          {electionData.electionVoters.length !== 0 ? (
            <div className="urna-table" style={{ maxWidth: "100%" }}>
              <nav
                className="pagination is-centered pt-6"
                role="navigation"
                aria-label="pagination"
              >
                <Button
                  onClick={() => {
                    changePage(-1);
                  }}
                  className="button-custom"
                >
                  Previo
                </Button>

                <Button
                  onClick={() => {
                    changePage(1);
                  }}
                  className="button-custom"
                >
                  Siguiente
                </Button>
              </nav>

              <div >
                <UrnaTable electionData={electionData} />
              </div>
            </div>
          ) : (
            <div className="box has-text-centered" id="not-results-box">
              <p className="is-size-3 has-text-weight-bold">
                Aun no existen votos registrados.
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="spinner-animation"></div>
      )}
    </>
  );
}

export default CastVoteView;
