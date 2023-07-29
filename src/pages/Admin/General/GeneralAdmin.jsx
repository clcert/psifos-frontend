import { Button } from "react-bulma-components";
import { useCallback, useState } from "react";
import { useEffect } from "react";
import { getElections } from "../../../services/election";
import { Link } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import ModalFreeze from "../AdministrationPanel/component/ModalFreeze";
import ModalCloseElection from "../AdministrationPanel/component/ModalCloseElection";
import ModalTally from "../AdministrationPanel/component/ModalTally";
import ModalCombineTally from "../AdministrationPanel/component/ModalCombineTally";
import UploadModal from "../VotersList/components/UploadModal";
import CardElection from "./components/CardElection";

function GeneralAdmin() {
  /** @state {array} all elections */
  const [elections, setElections] = useState([]);

  /** @state {array} elections showed in the election */
  const [electionsPage, setElectionsPage] = useState([]);

  /** @state {number} page elections */
  const [actualPage, setActualPage] = useState(0);

  /** @state {json} state modal freeze */
  const [freezeModal, setFreezeModal] = useState({
    state: false,
    shortName: "",
  });

  /** @state {json} state modal close election */
  const [closeModal, setCloseModal] = useState({ state: false, shortName: "" });

  /** @state {json} tally modal close election */
  const [tallyModal, setTallyModal] = useState({ state: false, shortName: "" });

  /** @state {json} state modal combine tally election */
  const [combineTallyModal, setCombineTallyModal] = useState({
    state: false,
    shortName: "",
  });

  /** @state {string} message with feeback for admin */
  const [feedbackMessage, setFeedbackMessage] = useState("");

  /** @state {string} feeback type for admin */
  const [typeFeedback, setTypeFeedback] = useState("");

  /** @state {bool} state for load information from backend */
  const [load, setLoad] = useState(false);

  /** @state {bool} upload modal state */
  const [uploadModal, setUploadModal] = useState({
    state: false,
    shortName: "",
  });

  const electionsForPage = 3;
  const nextDisabled =
    actualPage * electionsForPage + electionsForPage >= elections.length;
  const previousDisabled = actualPage === 0;

  function updateElectionStatus(shortName, status) {
    let auxElections = elections;
    for (let i = 0; i < auxElections.length; i++) {
      if (auxElections[i].short_name === shortName) {
        auxElections[i].election_status = status;
      }
    }
    setElections(auxElections);
  }

  const updateElections = useCallback(() => {
    const selectedElections = elections.slice(
      actualPage * electionsForPage,
      actualPage * electionsForPage + electionsForPage
    );
    setElectionsPage(selectedElections);
  }, [actualPage, elections]);

  useEffect(() => {
    setElectionsPage([]);
    updateElections();
  }, [actualPage, updateElections]);

  useEffect(() => {
    getElections().then((res) => {
      const { resp, jsonResponse } = res;
      if (resp.status === 200) {
        setElections(jsonResponse);
        setLoad(true);
      }
    });
  }, []);

  return (
    <>
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <TitlePsifos namePage="Detalle votaciones" nameElection={""} />
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
                  />
                  {feedbackMessage}
                </div>
              )}
              <div>
                <Button className="button-custom mb-2 mt-0 home-admin-button level-item">
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    className="link-button"
                    to="/psifos/admin/home"
                  >
                    Volver
                  </Link>
                </Button>
              </div>
              {electionsPage.map((election, index) => {
                return (
                  <CardElection
                    key={index}
                    election={election}
                    electionStatus={election.election_status}
                    freezeModal={() => {
                      setFreezeModal({
                        state: true,
                        shortName: election.short_name,
                      });
                    }}
                    closeModal={() => {
                      setCloseModal({
                        state: true,
                        shortName: election.short_name,
                      });
                    }}
                    tallyModal={() => {
                      setTallyModal({
                        state: true,
                        shortName: election.short_name,
                      });
                    }}
                    combineTallyModal={() => {
                      setCombineTallyModal({
                        state: true,
                        shortName: election.short_name,
                      });
                    }}
                    uploadModalonClick={(value) => {
                      setUploadModal({
                        state: true,
                        shortName: election.short_name,
                      });
                    }}
                  />
                );
              })}
              <div className="d-flex justify-content-between mt-4">
                <div className="d-flex mt-2">
                  <Button
                    className="button-custom home-admin-button btn-fixed"
                    disabled={previousDisabled}
                    onClick={() => {
                      setActualPage(actualPage - 1);
                    }}
                  >
                    Anterior
                  </Button>
                </div>
                <div className="d-flex mt-2">
                  <Button
                    className="button-custom home-admin-button btn-fixed"
                    disabled={nextDisabled}
                    onClick={() => {
                      setActualPage(actualPage + 1);
                    }}
                  >
                    Siguiente
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="spinner-animation"></div>
          )}
        </section>
        <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
        <ModalFreeze
          show={freezeModal.state}
          onHide={() => setFreezeModal(false)}
          freezeChange={() =>
            updateElectionStatus(freezeModal.shortName, "Started")
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={freezeModal.shortName}
        />
        <ModalCloseElection
          show={closeModal.state}
          onHide={() => setCloseModal(false)}
          endChange={() => updateElectionStatus(closeModal.shortName, "Ended")}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={closeModal.shortName}
        />

        <ModalTally
          show={tallyModal.state}
          onHide={() => setTallyModal(false)}
          tallyChange={() =>
            updateElectionStatus(tallyModal.shortName, "Tally computed")
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={tallyModal.shortName}
        />

        <ModalCombineTally
          show={combineTallyModal.state}
          onHide={() => setCombineTallyModal(false)}
          combineChange={() =>
            updateElectionStatus(
              combineTallyModal.shortName,
              "Decryptions combined"
            )
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={combineTallyModal.shortName}
        />
        <UploadModal
          show={uploadModal.state}
          onHide={() => setUploadModal(false)}
          shortName={uploadModal.shortName}
        />
      </div>
    </>
  );
}

export default GeneralAdmin;
