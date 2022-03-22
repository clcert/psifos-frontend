import { useState } from "react";
import { useParams } from "react-router-dom";
import ElectionCode from "../../../component/Footers/ElectionCode";
import { backendHeliosIP } from "../../../server";
import { useEffect } from "react";
import VotersTable from "./components/VotersTable";
import getElection from "../../../utils/getElection";
import SettingsUrna from "./components/SettingsUrna";
import Title from "../../../component/OthersComponents/Title";
import { Button } from "react-bulma-components";
import SubNavbar from "../component/SubNavbar";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";

function Urna() {
  const [admin, setAdmin] = useState(true);
  const [electionOpenReg, setElectionOpenReg] = useState(false);
  const [emailVoters, setEmailVoter] = useState(true);
  const [upload, setUpload] = useState(true);
  const [votersFiles, setVotersFiles] = useState([]);
  const [election, setElection] = useState([]);
  const [loading, setLoading] = useState(false);

  const { uuid } = useParams();

  useEffect(function effectFunction() {
    getElection(uuid).then((election) => {
      setElection(election);
    });
  }, []);

  if (!loading) {
    return (
      <div id="content-voters">
        <section className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <Title namePage="Urna Electronica" nameElection="test" />
          </div>
        </section>

        <SubNavbar active={3} />

        <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
          <div style={{ width: "70%" }}>
            {admin && !election.frozen_at && (
              <SettingsUrna reg={election.openreg} uuid={uuid} />
            )}
            <br />
            <div className="d-flex justify-content-center">
              {emailVoters && election.frozen_at && admin && (
                <Button
                  className="button-custom"
                  onClick={() => {
                    window.location.href =
                      backendHeliosIP +
                      "/app/elections/" +
                      uuid +
                      "/voters/email";
                  }}
                >
                  <span>Email voters</span>{" "}
                </Button>
              )}
              {admin && upload && !electionOpenReg && (
                <Button
                  className="button-custom ml-3"
                  onClick={() => {
                    window.location.href =
                      backendHeliosIP +
                      "/app/elections/" +
                      uuid +
                      "/voters/upload";
                  }}
                >
                  <span>Bulk upload voters</span>
                </Button>
              )}
            </div>

            {admin && (
              //</div>Add a Voter: WORK HERE
              <div style={{ textAlign: "center" }}>
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
              </div>
            )}
            <VotersTable uuid={uuid} election={election} />
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
