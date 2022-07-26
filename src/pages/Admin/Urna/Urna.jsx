import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ElectionCode from "../../../component/Footers/ElectionCode";
import VotersTable from "./components/VotersTable";
import Title from "../../../component/OthersComponents/Title";
import { Button } from "react-bulma-components";
import SubNavbar from "../component/SubNavbar";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import UploadModal from "./components/UploadModal";
import DeleteModal from "./components/DeleteModal";
import { getElection } from "../../../services/election";

function Urna() {
  /**
   * View of the urna
   */

  /** @state {bool} open election state */
  const [electionOpenReg, setElectionOpenReg] = useState(false);

  /** @state {array} election info */
  const [election, setElection] = useState([]);

  /** @state {bool} loading state */
  const [load, setLoad] = useState(false);

  /** @state {bool} upload modal state */
  const [uploadModal, setUploadModal] = useState(false);

  /** @state {bool} delete modal state */
  const [deleteModal, setDeleteModal] = useState(false);

  /** @urlParam {uuid} election uuid */
  const { uuid } = useParams();

  useEffect(function effectFunction() {
    getElection(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      setElection(jsonResponse);
      setElectionOpenReg(jsonResponse.openreg);
      setLoad(true);
    });
  }, []);

  return (
    <div id="content-voters">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Urna Electronica" nameElection={election.name} />
        </div>
      </section>

      <SubNavbar active={3} />

      <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
        {load ? (
          <div>
            {/* {!election.frozen_at && (
              <SettingsUrna
                reg={election.openreg}
                uuid={uuid}
                changeReg={(newState) => {
                  setElectionOpenReg(newState);
                }}
              />
            )} */}
            <br />
            <div className="d-flex justify-content-center">
              {/* {election.frozen_at && (
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
              )} */}

              {!electionOpenReg && (
                <>
                  <Button
                    className="button-custom ml-3"
                    onClick={() => {
                      setUploadModal(true);
                    }}
                  >
                    <span>Subir votantes</span>
                  </Button>
                  <Button
                    className="button progress-previous has-text-white has-text-weight-bold ml-3"
                    onClick={() => {
                      setDeleteModal(true);
                    }}
                  >
                    <span>Eliminar Votantes</span>
                  </Button>
                </>
              )}
            </div>

            <VotersTable uuid={uuid} election={election} />
          </div>
        ) : (
          <div className="spinner-animation"></div>
        )}
      </section>
      <ElectionCode uuid={uuid} />
      <UploadModal
        show={uploadModal}
        onHide={() => setUploadModal(false)}
        uuid={uuid}
      />
      <DeleteModal show={deleteModal} onHide={() => setDeleteModal(false)} />
    </div>
  );
}

export default Urna;
