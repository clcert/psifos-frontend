import MyNavbar from "../component/MyNavbar";
import { useState } from "react";
import Title from "../component/Title";
import { useParams } from "react-router-dom";
import ElectionCode from "../component/ElectionCode";
import { backendIP, backendHeliosIP } from "../server";
import { useEffect } from "react";

function Urna() {
  const [admin, setAdmin] = useState(true);
  const [electionFrozen, setElectionFrozen] = useState(true);
  const [electionPrivate, setElectionPrivate] = useState(false);
  const [electionOpenReg, setElectionOpenReg] = useState(false);
  const [categories, setCategories] = useState(false);
  const [emailVoters, setEmailVoter] = useState(true);
  const [upload, setUpload] = useState(true);
  const [votersFiles, setVotersFiles] = useState([]);
  const [voters, setVoters] = useState([]);
  const [q, setQ] = useState(false);
  const [election, setElection] = useState([]);
  const [votersPage, setVotersPage] = useState(1);
  const [totalVoters, setTotalVoters] = useState(0);
  const [loading, setLoading] = useState(false);

  const { uuid } = useParams();

  useEffect(function effectFunction() {
    async function getVoters() {
      const resp = await fetch(
        backendIP + "/elections/" + uuid + "/voters/info",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const jsonResponse = await resp.json();
      setVoters(jsonResponse);
    }
    getVoters();
  }, []);

  if (!loading) {
    return (
      <div id="content-voters">
        <section className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar />
            <Title namePage="Urna Electronica" nameElection="test" />
          </div>
        </section>

        <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
          <div>
            {admin && electionFrozen && (
              <div className="d-flex justify-content-center">
                {electionPrivate ? (
                  <em>
                    Your election is marked private, which means you cannot open
                    registration up more widely
                  </em>
                ) : (
                  <div>
                    You can change this setting
                    <form method="post">
                      <input
                        type="hidden"
                        name="csrf_token"
                        value="{{csrf_token}}"
                      />
                      <input type="radio" name="eligibility" value="openreg" />{" "}
                      Anyone can vote
                      <br />
                      <input
                        type="radio"
                        name="eligibility"
                        value="closedreg"
                      />{" "}
                      Only voters listed explicitly below can vote
                      <br />
                      {categories && (
                        <>
                          <input
                            type="radio"
                            name="eligibility"
                            value="limitedreg"
                          />{" "}
                          only voters who are members of
                          <select name="category_id">
                            {categories.map((category) => {
                              return <option value={category.id}></option>;
                            })}
                          </select>
                          <br />
                        </>
                      )}
                      <br />
                      <input type="submit" value="Update" />
                    </form>
                  </div>
                )}
              </div>
            )}
            <br />
            <div className="d-flex justify-content-center">
              {emailVoters && electionFrozen && admin && (
                <button
                  className="button review-buttons previous-button has-text-white has-text-weight-bold"
                  onClick={() => {
                    window.location.href =
                      backendHeliosIP +
                      "/app/elections/" +
                      uuid +
                      "/voters/email";
                  }}
                >
                  <span>Email voters</span>{" "}
                </button>
              )}
              {admin && upload && !electionOpenReg && (
                <button
                  className="ml-3 button review-buttons previous-button has-text-white has-text-weight-bold"
                  onClick={() => {
                    window.location.href =
                      backendHeliosIP +
                      "/app/elections/" +
                      uuid +
                      "/voters/upload";
                  }}
                >
                  <span>Bulk upload voters</span>
                </button>
              )}
            </div>

            {admin && (
              //</div>Add a Voter: WORK HERE
              <>
                {upload && !electionOpenReg && (
                  <>
                    <br />

                    {votersFiles && (
                      <>
                        Prior Bulk Uploads:
                        <ul>
                          {votersFiles.map((vf) => {
                            return (
                              <li>
                                vf.voter_file % ? ( vf.voter_file.size :
                                vf.voter_file_content) bytes, at vf.uploaded_at:
                                {vf.processing_finished_at ? (
                                  <em>
                                    done processing: {vf.num_voters} voters
                                    loaded
                                  </em>
                                ) : (
                                  <>
                                    {vf.processing_started_at ? (
                                      <em>currently processing</em>
                                    ) : (
                                      <em>not yet processed</em>
                                    )}
                                  </>
                                )}
                              </li>
                            );
                          })}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </>
            )}

            <p>
              <div className="search-box search_box p-2">
                <input
                  type="text"
                  id="ballot_searched"
                  name="q"
                  className="input_search"
                  placeholder="Buscar Papeleta..."
                />
                <div className="search-button" onclick="find_ballot()">
                  <i className="fas fa-lg fa-search"></i>
                </div>
              </div>
              <p id="search-message"></p>
            </p>

            {voters ? (
              <>
                <p className="search-box">
                  {election.num_cast_votes ? (
                    <>
                      <span className="has-text-weight-bold">
                        Total de votantes: {0}
                      </span>
                      <span> &nbsp; </span>
                      <span className="has-text-weight-bold">
                        &nbsp;Votos emitidos: {1}
                      </span>
                    </>
                  ) : (
                    <>
                      <span className="has-text-weight-bold">
                        Total de votantes: {0}
                      </span>
                      <span> &nbsp;/ </span>
                      <span className="has-text-weight-bold">
                        &nbsp;Votos emitidos: {0}
                      </span>
                    </>
                  )}
                </p>
                <nav
                  className="pagination is-centered pt-6"
                  role="navigation"
                  aria-label="pagination"
                >
                  {votersPage.has_previous ? (
                    <a className="pagination-previous" href="">
                      Previo
                    </a>
                  ) : (
                    <a className="pagination-previous" disabled>
                      Previo
                    </a>
                  )}
                  {votersPage.has_next ? (
                    <a className="pagination-next" href="">
                      Siguiente
                    </a>
                  ) : (
                    <a className="pagination-next" disabled>
                      Siguiente
                    </a>
                  )}
                  <ul className="pagination-list">
                    Papeletas {votersPage.start_index} - {votersPage.end_index}{" "}
                    (de {totalVoters})&nbsp;&nbsp;
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
                <table
                  id="voters-table"
                  className="pretty table is-bordered is-hoverable voters-table"
                >
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
                  {voters.map((voter) => {
                    return (
                      <tr>
                        {(admin || !election.use_voter_aliases) && (
                          <>
                            {admin && (
                              <>
                                <td style={{ whiteSpace: "nowrap" }}>
                                  {!election.frozen_at && (
                                    <a
                                      href={
                                        backendHeliosIP +
                                        "/app/elections/" +
                                        uuid +
                                        "/voters/email?voter_id=" +
                                        voter.voter_login_id
                                      }
                                    >
                                      email
                                    </a>
                                  )}
                                  <a
                                    onclick="return confirm('are you sure you want to remove {{voter.name}} ?');"
                                    href=""
                                  >
                                    x
                                  </a>
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
                          {!election.voting_stopped &&
                            admin && [
                              <a
                                href={
                                  backendHeliosIP +
                                  "/app/elections/" +
                                  uuid +
                                  "/voters/weight?voter_id=" +
                                  voter.voter_login_id
                                }
                              >
                                editar
                              </a>,
                            ]}
                        </td>
                      </tr>
                    );
                  })}
                </table>{" "}
              </>
            ) : (
              <>
                <br />
                <br />
                <em>no voters.</em>
              </>
            )}
          </div>
        </section>
        <ElectionCode uuid={uuid} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }
}

export default Urna;
