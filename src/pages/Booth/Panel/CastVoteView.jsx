import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bulma-components";
import { useParams, useSearchParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { backendInfoIp } from "../../../server";
import { getElectionInfo, getVotesInfo } from "../../../services/info";
import SubNavbarBooth from "./components/SubNavbarBooth";

function CastVoteView() {
  const [electionData, setElectionData] = useState({
    election: {},
    electionVotes: [],
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
          electionVotes: dataVotes.cast_vote,
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
            electionVotes: dataVotes.cast_vote,
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
        <div style={{ maxWidth: "100%" }}>
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
          {electionData.electionVotes !== [] && electionData.election !== [] ? (
            <div style={{ overflowX: "auto" }}>
              <table
                id="voters-table"
                className="pretty table is-bordered is-hoverable voters-table"
              >
                <thead>
                  <tr>
                    <th className="has-text-centered">Ponderador</th>
                    <th className="has-text-centered">Codigo de papeleta</th>
                    <th className="has-text-centered">Ver voto</th>
                  </tr>
                </thead>
                {electionData.electionVotes.map((vote, index) => {
                  return (
                    <tbody key={index}>
                      <tr>
                        <td
                          className={
                            "align-middle has-text-centered " +
                            (hashUrl === vote.vote_hash ? "hash-selected" : "")
                          }
                        >
                          {electionData.electionVoters[index].voter_weight}
                        </td>
                        <td
                          className={
                            "align-middle has-text-centered " +
                            (hashUrl === vote.vote_hash ? "hash-selected" : "")
                          }
                        >
                          {vote.vote_hash ? vote.vote_hash : "-"}
                        </td>
                        <td
                          className={
                            "align-middle has-text-centered " +
                            (hashUrl === vote.vote_hash ? "hash-selected" : "")
                          }
                        >
                          {vote.vote_hash ? (
                            <div
                              onClick={() => {
                                window.location.href = `${backendInfoIp}/election/${uuid}/cast-vote/${encodeURIComponent(
                                  vote.vote_hash
                                )}`;
                              }}
                              className="button-redirect-vote ml-2 mr-2"
                            >
                              <i className="fa-solid fa-check-to-slot mr-1"></i>
                              Ver voto
                            </div>
                          ) : (
                            "-"
                          )}
                        </td>
                      </tr>
                    </tbody>
                  );
                })}
              </table>
            </div>
          ) : (
            <div>Aun no existen votos.</div>
          )}
        </div>
      ) : (
        <div className="spinner-animation"></div>
      )}
    </>
  );
}

export default CastVoteView;
