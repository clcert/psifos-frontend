import { useState, useEffect } from "react";
import { backendOpIP, backendHeliosIP } from "../../../../server";
import ButtonAlert from "../../../../component/Alerts/ButtonAlert";
import IconAlert from "../../../../component/Alerts/IconAlert";
import { Button } from "react-bulma-components";
import { getStats } from "../../../../services/election";

function VotersTable(props) {
  const [voters, setVoters] = useState([]);
  const [election, setElection] = useState([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [maxForPage, setMaxForPage] = useState(4);
  const [voterForPage, setVoterForPage] = useState([]);
  const [previousDisabled, setPreviousDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [auxArrayVoters, setAuxArrayVoters] = useState([]);
  const [page, setPage] = useState(0);
  const [electionStatus, setElectionStatus] = useState("");

  useEffect(
    function effectFunction() {
      async function getVoters() {
        const token = sessionStorage.getItem("token");
        const resp = await fetch(
          backendOpIP + "/" + props.uuid + "/get-voters",
          {
            method: "GET",
            headers: {
              Authorization: "Bearer " + token,

              "Content-Type": "application/json",
            },
          }
        );

        const jsonResponse = await resp.json();
        if (resp.status === 200) {
          setTotalVoters(jsonResponse.length);
          //setTotalVotes(jsonResponse.info_votes.votes_cast);
          setVoters(jsonResponse);
          setAuxArrayVoters(jsonResponse);
          setVoterForPage(
            jsonResponse.slice(
              maxForPage * page,
              maxForPage * page + maxForPage
            )
          );
        } else {
        }
      }
      getVoters();
      getStats(props.uuid).then((data) => {
        const { jsonResponse } = data;
        setElectionStatus(jsonResponse.status);
      });
    },
    [props.voter]
  );

  function buttonAction(value, votersArray = auxArrayVoters) {
    /**
     * set button disabled or enabled
     * @param {string} value
     * @param {array} votersArray
     */
    const newPage = page + value;
    setPage(newPage);
    if (newPage > 0 || newPage * maxForPage + maxForPage > votersArray.length) {
      setPreviousDisabled(false);
    }
    if (newPage === 0) {
      setPreviousDisabled(true);
    }
    if (newPage * maxForPage + maxForPage >= votersArray.length) {
      setNextDisabled(true);
    }
    if (newPage * maxForPage + maxForPage < votersArray.length) {
      setNextDisabled(false);
    }

    setVoterForPage(
      votersArray.slice(maxForPage * newPage, maxForPage * newPage + maxForPage)
    );
  }

  function search(event) {
    /**
     * Search for a voter by name
     * @param {event} event
     */
    let auxArray = [];
    for (let i = 0; i < voters.length; i++) {
      let auxName = voters[i].name.toLowerCase();
      let auxEvent = event.target.value.toLowerCase();
      if (auxName.includes(auxEvent, 0)) {
        auxArray.push(voters[i]);
      }
    }
    setAuxArrayVoters(auxArray);
    buttonAction(0, auxArray);
  }

  if (voters.length !== 0) {
    return (
      <>
        <div className="search-box search_box p-2">
          <input
            type="text"
            id="ballot_searched"
            name="q"
            className="input_search"
            placeholder="Buscar Papeleta..."
            onChange={search}
          />
          <div className="search-button">
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

        <nav
          className="pagination is-centered pt-6"
          role="navigation"
          aria-label="pagination"
        >
          <Button
            className="button-custom"
            disabled={previousDisabled}
            onClick={() => {
              if (!previousDisabled) {
                buttonAction(-1);
              }
            }}
          >
            Previo
          </Button>

          <Button
            className="button-custom pagination-next"
            disabled={nextDisabled}
            onClick={() => {
              if (!nextDisabled) {
                buttonAction(1);
              }
            }}
          >
            Siguiente
          </Button>

          <ul className="pagination-list">
            Papeletas {page * maxForPage + 1} -{" "}
            {page * maxForPage + voterForPage.length} (de {totalVoters}
            )&nbsp;&nbsp;
            {/* {% comment %}
                <li><a className="pagination-link" href="{% url "election@voters@list-pretty" election.uuid %}?page=1&limit={{limit}}" aria-label="Goto page 1">1</a></li>
                <li><span className="pagination-ellipsis">&hellip;</span></li>
                <li><a className="pagination-link" aria-label="Goto page 45">45</a></li>
                <li><a className="pagination-link is-current" aria-label="Page 46" aria-current="page">46</a></li>
                <li><a className="pagination-link" aria-label="Goto page 47">47</a></li>
                <li><span className="pagination-ellipsis">&hellip;</span></li>
                <li><a className="pagination-link" aria-label="Goto page 86">86</a></li>
                {% endcomment %} */}
          </ul>
        </nav>
        <div>
          <table
            id="voters-table"
            className="pretty table is-bordered is-hoverable voters-table"
          >
            <thead>
              <tr>
                {!election.use_voter_aliases && (
                  <>
                    <th className="has-text-centered">Login</th>
                    {!election.openreg && (
                      <>
                        <th className="has-text-centered">VOTANTE</th>
                      </>
                    )}
                  </>
                )}

                {election.use_voter_aliases && <th>Alias</th>}
                <th className="has-text-centered">CÓDIGO DE PAPELETA</th>
                <th className="has-text-centered">Ponderador</th>
                <th className="has-text-centered">Actions</th>
              </tr>
            </thead>
            {voterForPage.map((voter, index) => {
              return (
                <tbody key={index}>
                  <tr>
                    <td className="align-middle has-text-centered">
                      {voter.voter_login_id}
                    </td>
                    {!election.openreg && (
                      <td className="align-middle has-text-centered">
                        {voter.voter_name}
                      </td>
                    )}

                    {election.use_voter_aliases && <td>{voter.alias}</td>}
                    <td>
                      <tt className="align-middle has-text-centered">
                        {voter.cast_vote.vote_hash}
                      </tt>
                    </td>
                    <td className="align-middle has-text-centered">
                      {election.normalization ? (
                        <>
                          {/* {% load tag %}
                            {% normalize_weight voter.voter_weight election.max_weight %}
                            TODO: Revisar esto, que hace la etiqueta tag */}
                        </>
                      ) : (
                        <>{voter.voter_weight} </>
                      )}

                      {election.voting_stopped && (
                        <IconAlert
                          icon="fa-solid fa-pen-to-square"
                          action={() => {
                            window.location.href =
                              backendHeliosIP +
                              "/app/elections/" +
                              props.uuid +
                              "/voters/weight?voter_id=" +
                              voter.voter_login_id;
                          }}
                        />
                      )}
                    </td>
                    <td
                      style={{ whiteSpace: "nowrap" }}
                      className="has-text-centered"
                    >
                      <div className="buttons-action-voter">
                        <div
                          onClick={() => {
                            props.editVoter(
                              voter.voter_name,
                              voter.uuid,
                              voter.voter_login_id,
                              voter.voter_weight
                            );
                          }}
                          className="button-edit-voter ml-2 mr-2"
                        >
                          <i className="fa-solid fa-pen-to-square"></i>
                        </div>
                        {electionStatus === "Setting up" && (
                          <div
                            onClick={() => {
                              props.deleteVoter(voter.voter_name, voter.uuid);
                            }}
                            className="button-delete-voter ml-2 mr-2"
                          >
                            <i className="fa-solid fa-trash"></i>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                </tbody>
              );
            })}
          </table>{" "}
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
