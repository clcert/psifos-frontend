import { useCallback, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { logout } from "../../../utils/utils";
import { getElection, getStats } from "../../../services/election";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import ExtendElection from "./component/ExtendElection";
import ModalFreeze from "./component/ModalFreeze";
import ModalCloseElection from "./component/ModalCloseElection";
import ModalTally from "./component/ModalTally";
import ModalCombineTally from "./component/ModalCombineTally";
import CardInfo from "./component/CardInfo";
import CardSettings from "./component/CardSettings";
import CardSteps from "./component/CardSteps";
import UploadModal from "../VotersList/components/UploadModal";
import ModalDeleteElection from "./component/ModalDeleteElection";
import { electionStatus } from "../../../constants";
import ModalResultsRelease from "./component/ModalReleaseResults";

import { useDispatch } from "react-redux";
import { setElection } from "../../../store/slices/electionSlice";
import { useSelector } from "react-redux";

/**
 * Main view of the administrator panel where you can modify the parameters of an election
 */

function AdministrationPanel(props) {
  const dispatch = useDispatch();
  const election = useSelector((state) => state.election.actualElection);

  /** @state {bool} modal state to extend voting */
  const [extendElectionModal, setExtendElectionModal] = useState(false);

  /** @state {num} total voters */
  const [totalVoters, setTotalVoters] = useState(0);

  /** @state {num} total votes */
  const [totalVotes, setTotalVotes] = useState(0);

  /** @state {bool} state modal freeze */
  const [freezeModal, setFreezeModal] = useState(false);

  /** @state {bool} state modal close election */
  const [closeModal, setCloseModal] = useState(false);

  /** @state {bool} state modal tally election */
  const [tallyModal, setTallyModal] = useState(false);

  /** @state {bool} state modal combine tally election */
  const [combineTallyModal, setCombineTallyModal] = useState(false);

  /** @state {bool} state modal delete election */
  const [deleteElectionModal, setDeleteElectionModal] = useState(false);

  /** @state {bool} state modal release election */
  const [releaseElectionModal, setReleaseElectionModal] = useState(false);

  /** @state {string} feedback message for admin */
  const [feedbackMessage, setFeedbackMessage] = useState("");

  /** @state {string} type feedback for admin */
  const [typeFeedback, setTypeFeedback] = useState("");

  const interTallyRef = useRef(null);

  /** @state {bool} state load  */
  const [load, setLoad] = useState(false);

  /** @state {bool} upload modal state */
  const [uploadModal, setUploadModal] = useState(false);

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  const updateInfo = useCallback(() => {
    /**
     * Get election and trustee info
     */
    getStats(shortName).then((res) => {
      const { jsonResponse } = res;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
    });
  }, [shortName]);

  const updateElection = useCallback(async () => {
    await getElection(shortName).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        dispatch(setElection(jsonResponse));
      } else if (resp.status === 401) {
        logout();
      }
    });
  }, [shortName, dispatch]);

  const tallyHandler = useCallback(() => {
    let interval = setInterval(async function () {
      await updateElection();
    }, 10000);
    interTallyRef.current = interval;
  }, [updateElection]);

  useEffect(() => {
    updateElection();
    setLoad(true);
    updateInfo();
    return () => {
      clearInterval(interTallyRef.current);
    };
  }, [updateElection, updateInfo]);

  useEffect(() => {
    if (
      interTallyRef.current === null &&
      election.election_status === electionStatus.computingTally
    ) {
      tallyHandler();
    } else {
      clearInterval(interTallyRef.current);
    }
  }, [election.election_status, tallyHandler]);
  return (
    <>
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <TitlePsifos
              namePage="Panel de Administración"
              nameElection={election.name}
            />
          </div>
        </section>

        <SubNavbar active={1} />

        <section
          className="section voters-section is-flex is-flex-direction-column is-align-items-center"
          id="accordion-section"
        >
          {load && Object.keys(election).length !== 0 ? (
            <div className="container is-max-desktop">
              {feedbackMessage && (
                <div
                  id="feedback-message"
                  className={"notification is-primary " + typeFeedback}
                >
                  <button
                    className="delete"
                    onClick={() => setFeedbackMessage("")}
                  ></button>
                  {feedbackMessage}
                </div>
              )}
              <div className="has-text-centered title is-size-4-mobile">
                {election.name}
              </div>
              <hr />
              <div className="columns">
                <div className="column">
                  <CardSettings
                    election={election}
                    setDeleteElectionModal={setDeleteElectionModal}
                  />
                  <CardSteps
                    election={election}
                    electionStep={election.election_status}
                    freezeModal={() => setFreezeModal(true)}
                    closeModal={() => setCloseModal(true)}
                    tallyModal={() => setTallyModal(true)}
                    combineTallyModal={() => setCombineTallyModal(true)}
                    releaseModal={() => setReleaseElectionModal(true)}
                    uploadModalonClick={(value) => {
                      setUploadModal(value);
                    }}
                  />
                </div>
                <div className="column">
                  <CardInfo
                    election={election}
                    electionStep={election.election_status}
                    updateInfo={updateInfo}
                    totalVoters={totalVoters}
                    totalVotes={totalVotes}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="spinner-animation"></div>
          )}
        </section>
        <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
        <ExtendElection
          show={extendElectionModal}
          onHide={() => setExtendElectionModal(false)}
        />
        <ModalFreeze
          show={freezeModal}
          onHide={() => setFreezeModal(false)}
          freezeChange={() =>
            dispatch(
              setElection({
                ...election,
                election_status: electionStatus.started,
              })
            )
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={shortName}
        />
        <ModalCloseElection
          show={closeModal}
          onHide={() => setCloseModal(false)}
          endChange={() =>
            dispatch(
              setElection({
                ...election,
                election_status: electionStatus.ended,
              })
            )
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={shortName}
        />

        <ModalTally
          show={tallyModal}
          onHide={() => setTallyModal(false)}
          tallyChange={() =>
            dispatch(
              setElection({
                ...election,
                election_status: electionStatus.computingTally,
              })
            )
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={shortName}
        />

        <ModalCombineTally
          show={combineTallyModal}
          onHide={() => setCombineTallyModal(false)}
          combineChange={() =>
            dispatch(
              setElection({
                ...election,
                election_status: electionStatus.decryptionsCombined,
              })
            )
          }
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={shortName}
        />
        <UploadModal
          show={uploadModal}
          onHide={() => setUploadModal(false)}
          shortName={shortName}
        />
        <ModalDeleteElection
          show={deleteElectionModal}
          onHide={() => setDeleteElectionModal(false)}
          shortName={shortName}
        />
        <ModalResultsRelease
          show={releaseElectionModal}
          onHide={() => setReleaseElectionModal(false)}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          shortName={shortName}
        />
      </div>
    </>
  );
}

export default AdministrationPanel;
