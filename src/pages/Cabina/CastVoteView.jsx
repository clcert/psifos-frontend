import { useState } from "react";
import { useEffect } from "react";
import { Button } from "react-bulma-components";
import { useParams, useSearchParams } from "react-router-dom";
import FooterParticipa from "../../component/Footers/FooterParticipa";
import Title from "../../component/OthersComponents/Title";
import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import {
  getElectionInfo,
  getVotesInfo,
} from "../../services/info";

function CastVoteView() {
  const [electionData, setElectionData] = useState({
    election: {},
    electionVotes: [],
    electionVoters: [],
    actualPage: 0,
  });

  const [lengthPage, setLengthPage] = useState(5);
  const { uuid } = useParams();

  const [searchParams, setSearchParams] = useSearchParams();

  const hashUrl = searchParams.get("hash");

  useEffect(() => {
    getVotesInfo(uuid, electionData.actualPage * lengthPage, lengthPage, hashUrl).then(
      (dataVotes) => {
        getElectionInfo(uuid).then((dataElection) => {
          setElectionData({
            ...electionData,
            election: dataElection,
            electionVotes: dataVotes.cast_vote,
            electionVoters: dataVotes.voters,
            actualPage: Math.floor(dataVotes.position / lengthPage)
          });
        });
      }
    );
  }, []);

  function changePage(number) {
    const newPage = electionData.actualPage + number;
    console.log(newPage);
    if (newPage >= 0) {
      getVotesInfo(uuid, newPage * lengthPage, lengthPage, "").then((dataVotes) => {
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
    <div id="content-results">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar linkExit="" linkInit="" />
          <Title
            namePage="Urna Electronica"
            nameElection={electionData.election.name}
          />
        </div>
      </section>

      <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
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
            className="button-custom pagination-next"
          >
            Siguiente
          </Button>
        </nav>

        <div>
          {electionData.electionVotes !== [] && electionData.election !== [] ? (
            <table
              id="voters-table"
              className="pretty table is-bordered is-hoverable voters-table"
            >
              <thead>
                <tr>
                  <th className="has-text-centered">Ponderador</th>
                  <th className="has-text-centered">Hash</th>
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
                    </tr>
                  </tbody>
                );
              })}
            </table>
          ) : (
            <>a</>
          )}
        </div>
      </section>

      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default CastVoteView;
