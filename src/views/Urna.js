import MyNavbar from "../component/MyNavbar";
import { useState } from "react";
import Title from "../component/Title";
import { useParams } from "react-router-dom";
import ElectionCode from "../component/ElectionCode";
import { backendIP, backendHeliosIP } from "../server";
import { useEffect } from "react";
import VotersTable from "../component/VotersTable";
import ConfirmAlert from "../component/ConfirmAlert";

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

              <div className="search-box search_box p-2">
                <input
                  type="text"
                  id="ballot_searched"
                  name="q"
                  className="input_search"
                  placeholder="Buscar Papeleta..."
                />
                <div className="search-button">
                  <i className="fas fa-lg fa-search"></i>
                </div>
              </div>
              <p id="search-message"></p>

            {voters ? (
              <VotersTable uuid={uuid} />
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
