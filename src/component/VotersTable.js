import { useState, useEffect } from "react";
import { backendIP, backendHeliosIP, frontIP } from "../server";
import ConfirmAlert from "./ConfirmAlert";
import $ from "jquery";

function VotersTable(props) {
  const [voters, setVoters] = useState([]);
  const [election, setElection] = useState([]);
  const [admin, setAdmin] = useState(true);
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [maxForPage, setMaxForPage] = useState(4);
  const [voterForPage, setVoterForPage] = useState([]);
  const [previousDisabled, setPreviousDisabled] = useState(true);
  const [nextDisabled, setNextDisabled] = useState(false);
  const [auxArrayVoters, setAuxArrayVoters] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(function effectFunction() {
    async function getVoters() {
      const resp = await fetch(
        backendIP + "/elections/" + props.uuid + "/voters/info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const jsonResponse = await resp.json();
      setTotalVoters(jsonResponse.info_votes.total_voters);
      setTotalVotes(jsonResponse.info_votes.votes_cast);
      setVoters(jsonResponse.info_voters);
      setAuxArrayVoters(jsonResponse.info_voters);
      setVoterForPage(
        jsonResponse.info_voters.slice(
          maxForPage * page,
          maxForPage * page + maxForPage
        )
      );
    }
    getVoters();
  }, []);

  function buttonAction(value, votersArray = auxArrayVoters) {
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
    console.log(voterForPage);
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
          <a
            className="pagination-previous"
            disabled={previousDisabled}
            onClick={() => {
              if (!previousDisabled) {
                buttonAction(-1);
              }
            }}
          >
            Previo
          </a>

          <a
            className="pagination-next"
            disabled={nextDisabled}
            onClick={() => {
              if (!nextDisabled) {
                buttonAction(1);
              }
            }}
          >
            Siguiente
          </a>

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
        <div style={{ overflowX: "auto" }}>
          <table
            id="voters-table"
            className="pretty table is-bordered is-hoverable voters-table"
          >
            <thead>
              <tr>
                {(admin || !election.use_voter_aliases) && (
                  <>
                    {admin && (
                      <>
                        <th>Actions</th>
                        <th>Login</th>
                        {!election.openreg && (
                          <>
                            <th>Email Address</th>
                            <th>VOTANTE</th>
                          </>
                        )}
                      </>
                    )}
                  </>
                )}

                {election.use_voter_aliases && <th>Alias</th>}
                <th>CÓDIGO DE PAPELETA</th>
                <th>Ponderador</th>
              </tr>
            </thead>
            {voterForPage.map((voter, index) => {
              return (
                <tbody key={index}>
                  <tr>
                    {(admin || !election.use_voter_aliases) && (
                      <>
                        {admin && (
                          <>
                            <td style={{ whiteSpace: "nowrap" }}>
                              [
                              {!election.frozen_at && (
                                <a
                                  href={
                                    backendHeliosIP +
                                    "/app/elections/" +
                                    props.uuid +
                                    "/voters/email?voter_id=" +
                                    voter.voter_login_id
                                  }
                                >
                                  email
                                </a>
                              )}
                              ] [
                              <ConfirmAlert
                                title={"Eliminar " + voter.name}
                                alert={"X"}
                                message={
                                  "Are you sure you want to remove " +
                                  voter.name +
                                  "?"
                                }
                                action={() => {
                                  window.location.href =
                                    backendHeliosIP +
                                    "/app/elections/" +
                                    props.uuid +
                                    "/voters/" +
                                    voter.uuid +
                                    "/delete";
                                }}
                              />
                              ]
                            </td>
                            <td>{voter.voter_login_id}</td>
                            {!election.openreg && (
                              <>
                                <td>{voter.voter_email}</td>
                                <td>{voter.name}</td>
                              </>
                            )}
                          </>
                        )}
                      </>
                    )}
                    {election.use_voter_aliases && <td>{voter.alias}</td>}
                    <td>
                      <tt>
                        {
                          voter.vote_hash ? (
                            <>
                              {voter.vote_hash}
                              {admin && (
                                <span style={{ fontSize: "0.8em" }}>
                                  [<a href="">view</a>]
                                </span>
                              )}
                            </>
                          ) : (
                            <></>
                          ) // TODO: Revisar esto
                        }
                      </tt>
                    </td>
                    <td className="has-text-centered">
                      {election.normalization ? (
                        <>
                          {/* {% load tag %}
                            {% normalize_weight voter.voter_weight election.max_weight %}
                            TODO: Revisar esto, que hace la etiqueta tag */}
                        </>
                      ) : (
                        <>{voter.voter_weight} </>
                      )}
                      [
                      {!election.voting_stopped && admin && (
                        <a
                          href={
                            backendHeliosIP +
                            "/app/elections/" +
                            props.uuid +
                            "/voters/weight?voter_id=" +
                            voter.voter_login_id
                          }
                        >
                          editar
                        </a>
                      )}
                      ]
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
      <>
        <br />
        <br />
        <em>no voters.</em>
      </>
    );
  }
}

export default VotersTable;
