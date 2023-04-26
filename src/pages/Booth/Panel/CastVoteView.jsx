import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bulma-components";
import { useParams, useSearchParams } from "react-router-dom";
import { getElectionInfo, getVotesInfo } from "../../../services/info";
import UrnaTable from "./components/UrnaTable";

function CastVoteView() {
  const [electionData, setElectionData] = useState({
    election: {},
    electionVoters: [],
    actualPage: 0,
    totalVotes: 0,
  });
  const [loadData, setLoadData] = useState(false);
  const [disabledNext, setDisabledNext] = useState(true);
  const [disabledPrevious, setDisabledPrevious] = useState(true);

  const [searchParams] = useSearchParams();
  const { shortName } = useParams();

  const lengthPage = 50;

  const hashUrl =
    searchParams.get("hash") !== null ? searchParams.get("hash") : undefined;

  function getDataVotes() {
    getVotesInfo(
      shortName,
      electionData.actualPage * lengthPage,
      lengthPage,
      hashUrl
    ).then((dataVotes) => {
      getElectionInfo(shortName).then((dataElection) => {
        const page = Math.floor(dataVotes.position / lengthPage);
        setDisabledPrevious(page === 0 ? true : false);
        setDisabledNext(!dataVotes.more_votes);

        setElectionData({
          ...electionData,
          election: dataElection,
          electionVoters: dataVotes.voters,
          actualPage: page,
          totalVotes: dataVotes.total_votes,
        });
        setLoadData(true);
      });
    });
  }

  useEffect(() => {
    getDataVotes();
  }, []);

  function changePage(number) {
    /**
     * Change the page getting the corresponding votes
     */

    const newPage = electionData.actualPage + number;
    if (newPage >= 0) {
      getVotesInfo(shortName, newPage * lengthPage, lengthPage, "").then(
        (dataVotes) => {
          if (dataVotes.voters.length !== 0) {
            setDisabledNext(false);
            setDisabledPrevious(newPage === 0 ? true : false);
            setDisabledNext(!dataVotes.more_votes);
            setElectionData({
              ...electionData,
              electionVoters: dataVotes.voters,
              actualPage: newPage,
            });
          } else {
            setDisabledNext(true);
          }
        }
      );
    }
  }

  const totalPages = Math.ceil(electionData.totalVotes / lengthPage);

  return (
    <>
      {loadData ? (
        <>
          {electionData.electionVoters.length !== 0 ? (
            <div className="urna-table" style={{ maxWidth: "100%" }}>
              <div className="row">
                <div className="col-6 d-flex align-self-start">
                  <Button
                    onClick={() => {
                      changePage(-1);
                    }}
                    className="button-custom btn-fixed"
                    disabled={disabledPrevious}
                  >
                    Previo
                  </Button>
                </div>
                <div className="col-6 d-flex justify-content-end">
                  <Button
                    onClick={() => {
                      changePage(1);
                    }}
                    className="button-custom btn-fixed"
                    disabled={disabledNext}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
              <div className="d-flex justify-content-center mt-2">
                <span>
                  Página {electionData.actualPage + 1} de {totalPages}{" "}
                  (Mostrando 1-{lengthPage} de {electionData.totalVotes}{" "}
                  resultados)
                </span>
              </div>
              <div className="mt-1">
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
