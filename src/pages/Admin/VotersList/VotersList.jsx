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
import DeleteVoterModal from "./components/DeleteVoterModal";
import EditVoterModal from "./components/EditVoterModal";

function VotersList() {
  /**
   * View of the VotersList
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

  /** @state {bool} delete voter modal state */
  const [deleteVoterModal, setDeleteVoterModal] = useState(false);

  /** @state {bool} delete voter modal state */
  const [editVoterModal, setEditVoterModal] = useState(false);

  const [voterSelect, setVoterSelect] = useState({
    voter_name: "",
    uuid: "",
    voter_login_id: "",
    voter_weight: "",
  });

  /** @urlParam {uuid} election uuid */
  const { uuid } = useParams();

  useEffect(
    function effectFunction() {
      getElection(uuid).then((election) => {
        const { jsonResponse } = election;
        setElection(jsonResponse);
        setElectionOpenReg(jsonResponse.openreg);
        setLoad(true);
      });
    },
    [uuid]
  );

  return (
    <div id="content-home-admin">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Padrón" nameElection={election.name} />
        </div>
      </section>

      <SubNavbar active={3} />

      <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
        {load ? (
          <div>
            <br />
            <div className="d-flex justify-content-center">
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
                  {election.election_status == "Setting up" && (
                    <Button
                      className="button progress-previous has-text-white has-text-weight-bold ml-3"
                      onClick={() => {
                        setDeleteModal(true);
                      }}
                    >
                      <span>Eliminar Votantes</span>
                    </Button>
                  )}
                </>
              )}
            </div>

            <VotersTable
              voter={voterSelect}
              uuid={uuid}
              election={election}
              setVoterSelect={setVoterSelect}
              setDeleteVoterModal={setDeleteVoterModal}
              setEditVoterModal={setEditVoterModal}
            />
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
      <DeleteVoterModal
        show={deleteVoterModal}
        onHide={() => setDeleteVoterModal(false)}
        voter={voterSelect}
        setVoterSelect={setVoterSelect}
      />
      <EditVoterModal
        show={editVoterModal}
        onHide={() => setEditVoterModal(false)}
        voter={voterSelect}
        setVoterSelect={setVoterSelect}
      />
    </div>
  );
}

export default VotersList;
