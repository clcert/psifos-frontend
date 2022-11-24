import { useCallback, useEffect, useState } from "react";
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

/**
 * Main view of the administrator panel where you can modify the parameters of an election
 */

function AdministrationPanel(props) {
  const [election, setElection] = useState([]);

  /** @state {bool} modal state to extend voting */
  const [extendElectionModal, setExtendElectionModal] = useState(false);

  /** @state {bool} election have obscure state */
  const [obscureVoter, setObscureVoter] = useState(true);

  /** @state {bool} election private */
  const [privateElection, setPrivateElection] = useState(true);

  /** @state {bool} election have audit */
  const [totalVoters, setTotalVoters] = useState(0);

  const [totalVotes, setTotalVotes] = useState(0);

  /** @state {bool} election have audit */
  const [randomizeAnswers, setRandomizeAnswers] = useState(true);

  /** @state {string} election type */
  const [typeElection, setTypeElection] = useState("");

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

  /** @state {string} feedback message for admin */
  const [feedbackMessage, setFeedbackMessage] = useState("");

  /** @state {string} type feedback for admin */
  const [typeFeedback, setTypeFeedback] = useState("");

  /** @state {string} election status */
  const [electionStatus, setElectionStatus] = useState("");

  /** @state {array} array with all trustees */
  const [trustees, setTrustees] = useState([]);

  /** @state {bool} state load  */
  const [load, setLoad] = useState(false);

  /** @state {bool} upload modal state */
  const [uploadModal, setUploadModal] = useState(false);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  const updateInfo = useCallback(() => {
    /**
     * Get election and trustee info
     */
    getElection(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        setElection(jsonResponse);
        setElectionStatus(jsonResponse.election_status);
        setTrustees(jsonResponse.trustees);
        setObscureVoter(jsonResponse.obscure_voter_names);
        setPrivateElection(jsonResponse.private_p);
        setRandomizeAnswers(jsonResponse.randomize_answer_order);
        setTypeElection(jsonResponse.election_type);
        setLoad(true);
      } else if (resp.status === 401) {
        logout();
      }
    });
    getStats(uuid).then((res) => {
      const { jsonResponse } = res;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
    });
  }, [uuid]);

  useEffect(() => {
    updateInfo();
  }, [updateInfo]);

  return (
    <>
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <TitlePsifos
              namePage="Panel de administración"
              nameElection={election.name}
            />
          </div>
        </section>

        <SubNavbar active={1} />

        <section
          className="section voters-section is-flex is-flex-direction-column is-align-items-center"
          id="accordion-section"
        >
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
                    electionStatus={electionStatus}
                    freezeModal={() => setFreezeModal(true)}
                    closeModal={() => setCloseModal(true)}
                    tallyModal={() => setTallyModal(true)}
                    combineTallyModal={() => setCombineTallyModal(true)}
                    uploadModalonClick={(value) => {
                      setUploadModal(value);
                    }}
                  />
                </div>
                <div className="column">
                  <CardInfo
                    electionStatus={electionStatus}
                    updateInfo={updateInfo}
                    typeElection={typeElection}
                    totalVoters={totalVoters}
                    totalVotes={totalVotes}
                    obscureVoter={obscureVoter}
                    privateElection={privateElection}
                    randomizeAnswers={randomizeAnswers}
                    trustees={trustees}
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="spinner-animation"></div>
          )}
        </section>
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
        <ExtendElection
          show={extendElectionModal}
          onHide={() => setExtendElectionModal(false)}
        />
        <ModalFreeze
          show={freezeModal}
          onHide={() => setFreezeModal(false)}
          freezeChange={() => setElectionStatus("Started")}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={uuid}
        />
        <ModalCloseElection
          show={closeModal}
          onHide={() => setCloseModal(false)}
          endChange={() => setElectionStatus("Ended")}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={uuid}
        />

        <ModalTally
          show={tallyModal}
          onHide={() => setTallyModal(false)}
          tallyChange={() => setElectionStatus("Tally computed")}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={uuid}
        />

        <ModalCombineTally
          show={combineTallyModal}
          onHide={() => setCombineTallyModal(false)}
          combineChange={() => setElectionStatus("Decryptions combined")}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={uuid}
        />
        <UploadModal
          show={uploadModal}
          onHide={() => setUploadModal(false)}
          uuid={uuid}
        />
        <ModalDeleteElection
          show={deleteElectionModal}
          onHide={() => setDeleteElectionModal(false)}
          uuid={uuid}
        />
      </div>
    </>
  );
}

export default AdministrationPanel;
