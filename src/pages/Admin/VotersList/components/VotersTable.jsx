import { useState, useEffect } from "react";
import { backendOpIP } from "../../../../server";
import { Button } from "react-bulma-components";
import { getStats } from "../../../../services/election";

function VotersTable(props) {
  const [voters, setVoters] = useState([]);
  const [election, setElection] = useState([]);
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [maxForPage, setMaxForPage] = useState(9);
  const [previousDisabled, setPreviousDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [actualPage, setPage] = useState(0);
  const [electionStatus, setElectionStatus] = useState("");

  async function getVoters(page) {
    const token = sessionStorage.getItem("token");
    const resp = await fetch(backendOpIP + "/" + props.uuid + "/get-voters", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,

        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        page: page,
        page_size: maxForPage,
      }),
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }

  useEffect(
    function effectFunction() {
      getVoters(actualPage).then((dataVoters) => {
        setTotalVoters(dataVoters.length);
        setVoters(dataVoters);
      });
      getStats(props.uuid).then((data) => {
        const { jsonResponse } = data;
        setElectionStatus(jsonResponse.status);
      });
    },
    [props.voter]
  );

  function buttonAction(value) {
    /**
     * set button disabled or enabled
     * @param {string} value
     */
    const newPage = actualPage + value;

    if (newPage === 0){
      setPreviousDisabled(true);
    }

    if (newPage >= 0) {
      getVoters(newPage).then((dataVoters) => {
        if (dataVoters.length !== 0) {
          setNextDisabled(false)
          setPreviousDisabled(false);
          setTotalVoters(dataVoters.length);
          setVoters(dataVoters);
          setPage(newPage);
        }
        else{
          setNextDisabled(true);
        }
      });
    }
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
            Papeletas {actualPage * maxForPage + 1} -{" "}
            {actualPage * maxForPage + voters.length} (de {totalVoters}
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
            {voters.map((voter, index) => {
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
