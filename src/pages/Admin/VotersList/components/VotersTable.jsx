import { useState, useEffect, useCallback } from "react";
import { backendOpIP } from "../../../../server";
import { Button } from "react-bulma-components";
import { getStats } from "../../../../services/election";

import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";
import "react-super-responsive-table/dist/SuperResponsiveTableStyle.css";
import { getVotesInfo } from "../../../../services/info";

function VotersTable({
  election = {},
  setVoterSelect,
  setDeleteVoterModal,
  setEditVoterModal,
}) {
  const [voters, setVoters] = useState([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [previousDisabled, setPreviousDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [actualPage, setPage] = useState(0);
  const [electionStatus, setElectionStatus] = useState("");
  const [voterToSearch, setVoterToSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const maxForPage = 50;

  const getVoters = useCallback(
    async (page, voterName = "") => {
      getVotesInfo(election.short_name, page, maxForPage, {
        voterName: voterName,
      }).then((data) => {
        setVoters(data.voters);
        setNextDisabled(!data.more_votes);
      });
    },
    [election]
  );

  useEffect(
    function effectFunction() {
      getVoters(0);
      getStats(election.short_name).then((data) => {
        const { jsonResponse } = data;
        setElectionStatus(jsonResponse.status);
        setTotalVoters(jsonResponse.total_voters);
        setTotalVotes(jsonResponse.num_casted_votes);
        setIsLoading(false);
      });
    },
    [election, getVoters]
  );

  function buttonAction(value) {
    /**
     * set button disabled or enabled
     * @param {string} value
     */
    const newPage = actualPage + value;
    setPage(newPage);
    setPreviousDisabled(newPage === 0);

    if (newPage >= 0) {
      getVoters(newPage);
    }
  }

  function search() {
    /**
     * Search for a voter by name
     * @param {event} event
     */
    getVoters(0, voterToSearch);
  }

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center pt-4">
        <div className="spinner-animation"></div>
      </div>
    );
  }

  if (totalVoters > 0) {
    return (
      <>
        <div
          className="search-box search_box p-2"
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              search();
            }
          }}
        >
          <input
            type="text"
            id="ballot_searched"
            name="q"
            className="input_search"
            placeholder="Buscar Papeleta..."
            value={voterToSearch}
            onChange={(e) => {
              setVoterToSearch(e.target.value);
            }}
          />
          <div className="search-button" onClick={search}>
            <i className="fas fa-lg fa-search"></i>
          </div>
        </div>
        <p id="search-message"></p>
        <p className="search-box">
          {election.num_cast_votes ? (
            <>
              <span className="has-text-weight-bold">
                Total de votantes: {totalVoters}
              </span>
              <span> &nbsp; </span>
              <span className="has-text-weight-bold">
                &nbsp;Votos emitidos: {totalVotes}
              </span>
            </>
          ) : (
            <>
              <span className="has-text-weight-bold">
                Total de votantes: {totalVoters}
              </span>
              <span> &nbsp;/ </span>
              <span className="has-text-weight-bold">
                &nbsp;Votos emitidos: {totalVotes}
              </span>
            </>
          )}
        </p>
        <div className="row mt-4">
          <div className="col-6">
            <Button
              className="btn-fixed button-custom"
              disabled={previousDisabled}
              onClick={() => {
                if (!previousDisabled) {
                  buttonAction(-1);
                }
              }}
            >
              Previo
            </Button>
          </div>
          <div className="col-6 d-inline-flex justify-content-end">
            <Button
              className="btn-fixed button-custom"
              disabled={nextDisabled}
              onClick={() => {
                if (!nextDisabled) {
                  buttonAction(1);
                }
              }}
            >
              Siguiente
            </Button>
          </div>
        </div>

        <div>
          <Table className="pretty table is-bordered is-hoverable voters-table">
            <Thead>
              <Tr>
                <Th className="has-text-centered">Login</Th>
                <Th className="has-text-centered">Votante</Th>
                <Th className="has-text-centered">Código de papeleta</Th>
                <Th className="has-text-centered">Ponderador</Th>
                <Th className="has-text-centered">Actions</Th>
              </Tr>
            </Thead>
            {voters.map((voter, index) => {
              const voterHash = voter.cast_vote
                ? voter.cast_vote.vote_hash
                : "-";
              return (
                <Tbody key={index}>
                  <Tr>
                    <Td className="align-middle has-text-centered">
                      {voter.voter_login_id}
                    </Td>

                    <Td className="align-middle has-text-centered">
                      {voter.voter_name}
                    </Td>
                    <Td className="align-middle has-text-centered">
                      <span className="urna-voter-hash">{voterHash}</span>
                    </Td>
                    <Td className="align-middle has-text-centered">
                      {election.normalization ? (
                        <span>
                          {parseFloat(
                            (voter.voter_weight / election.max_weight).toFixed(
                              3
                            )
                          )}
                        </span>
                      ) : (
                        <span>{voter.voter_weight} </span>
                      )}
                    </Td>
                    <Td
                      style={{ whiteSpace: "nowrap" }}
                      className="has-text-centered"
                    >
                      <div className="buttons-action-voter">
                        <div
                          onClick={() => {
                            setVoterSelect((prevState) => ({
                              ...prevState,
                              voter_name: voter.voter_name,
                              uuid: voter.uuid,
                              voter_login_id: voter.voter_login_id,
                              voter_weight: voter.voter_weight,
                            }));
                            setEditVoterModal(true);
                          }}
                          className="button-edit-voter ml-2 mr-2"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </div>
                        {!voter.cast_vote && (
                          <div
                            onClick={() => {
                              setVoterSelect((prevState) => ({
                                ...prevState,
                                voter_name: voter.voter_name,
                                uuid: voter.uuid,
                              }));
                              setDeleteVoterModal(true);
                            }}
                            className="button-delete-voter ml-2 mr-2"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </div>
                        )}
                      </div>
                    </Td>
                  </Tr>
                </Tbody>
              );
            })}
          </Table>{" "}
        </div>
      </>
    );
  } else {
    return (
      <div className="box mt-4" id="not-results-box">
        <p className="is-size-3 has-text-weight-bold">Aun no hay votantes.</p>
      </div>
    );
  }
}

export default VotersTable;
