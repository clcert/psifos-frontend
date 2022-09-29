import { Button } from "react-bulma-components";
import { useState } from "react";
import { useEffect } from "react";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { getElection, getElections } from "../../../services/election";
import CardElection from "./components/CardElection";
import { Link } from "react-router-dom";
import ModalFreeze from "../AdministrationPanel/component/ModalFreeze";
import ModalCloseElection from "../AdministrationPanel/component/ModalCloseElection";
import ModalTally from "../AdministrationPanel/component/ModalTally";
import ModalCombineTally from "../AdministrationPanel/component/ModalCombineTally";
import UploadModal from "../Padron/components/UploadModal";

function GeneralAdmin() {
  const [elections, setElections] = useState([]);

  /** @state {bool} state modal freeze */
  const [freezeModal, setFreezeModal] = useState({ state: false, uuid: "" });

  /** @state {bool} state modal close election */
  const [closeModal, setCloseModal] = useState({ state: false, uuid: "" });

  const [tallyModal, setTallyModal] = useState({ state: false, uuid: "" });

  const [combineTallyModal, setCombineTallyModal] = useState({
    state: false,
    uuid: "",
  });

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [typeFeedback, setTypeFeedback] = useState("");

  const [load, setLoad] = useState(false);

  /** @state {bool} upload modal state */
  const [uploadModal, setUploadModal] = useState({ state: false, uuid: "" });

  function updateElectionStatus(uuid, status) {
    let auxElections = elections;
    for (let i = 0; i < auxElections.length; i++) {
      if (auxElections[i].uuid === uuid) {
        auxElections[i].election_status = status;
      }
    }
    setElections(auxElections);
  }

  function updateElections() {
    getElections().then((res) => {
      const { resp, jsonResponse } = res;
      if (resp.status === 200) {
        setElections(jsonResponse);
        setLoad(true);
      }
    });
  }

  useEffect(() => {
    updateElections();
  }, []);

  return (
    <>
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <Title namePage="Panel de administración" nameElection={""} />
          </div>
        </section>

        <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
          {load ? (
            <div className="container is-max-desktop">
              {feedbackMessage && (
                <div className={"notification is-primary " + typeFeedback}>
                  <button
                    className="delete"
                    onClick={() => setFeedbackMessage("")}
                  ></button>
                  {feedbackMessage}
                </div>
              )}
              <div>
                <Button className="button-custom mb-2 mt-0 home-admin-button level-item">
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    className="link-button"
                    to="/admin/home"
                  >
                    Volver Atras
                  </Link>
                </Button>
              </div>
              {elections.map((election) => {
                return (
                  <CardElection
                    election={election}
                    electionStatus={election.election_status}
                    freezeModal={() => {
                      setFreezeModal({ state: true, uuid: election.uuid });
                    }}
                    closeModal={() => {
                      setCloseModal({ state: true, uuid: election.uuid });
                    }}
                    tallyModal={() => {
                      setTallyModal({ state: true, uuid: election.uuid });
                    }}
                    combineTallyModal={() => {
                      setCombineTallyModal({
                        state: true,
                        uuid: election.uuid,
                      });
                    }}
                    uploadModalonClick={(value) => {
                      setUploadModal({ state: true, uuid: election.uuid });
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="spinner-animation"></div>
          )}
        </section>
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
        <ModalFreeze
          show={freezeModal.state}
          onHide={() => setFreezeModal(false)}
          freezeChange={() => updateElectionStatus(freezeModal.uuid, "Started")}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={freezeModal.uuid}
        />
        <ModalCloseElection
          show={closeModal.state}
          onHide={() => setCloseModal(false)}
          endChange={() => updateElectionStatus(closeModal.uuid, "Ended")}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={closeModal.uuid}
        />

        <ModalTally
          show={tallyModal.state}
          onHide={() => setTallyModal(false)}
          tallyChange={() =>
            updateElectionStatus(tallyModal.uuid, "Tally computed")
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={tallyModal.uuid}
        />

        <ModalCombineTally
          show={combineTallyModal.state}
          onHide={() => setCombineTallyModal(false)}
          combineChange={() =>
            updateElectionStatus(combineTallyModal.uuid, "Decryptions combined")
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={combineTallyModal.uuid}
        />
        <UploadModal
          show={uploadModal.state}
          onHide={() => setUploadModal(false)}
          uuid={uploadModal.uuid}
        />
      </div>
    </>
  );
}

export default GeneralAdmin;
