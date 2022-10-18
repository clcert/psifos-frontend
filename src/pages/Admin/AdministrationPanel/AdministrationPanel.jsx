import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import ExtendElection from "./component/ExtendElection";
import ModalFreeze from "./component/ModalFreeze";
import ModalCloseElection from "./component/ModalCloseElection";
import { getElection, getStats } from "../../../services/election";
import ModalTally from "./component/ModalTally";
import ModalCombineTally from "./component/ModalCombineTally";
import CardInfo from "./component/CardInfo";
import CardSettings from "./component/CardSettings";
import CardSteps from "./component/CardSteps";
import UploadModal from "../VotersList/components/UploadModal";
import { logout } from "../../../utils/utils";

/**
 * Main view of the administrator panel where you can modify the parameters of an election
 */

function AdministrationPanel(props) {
  /** @state {bool} modal state to extend voting */
  const [extendElectionModal, setExtendElectionModal] = useState(false);

  /** @state {bool} election have questions */
  const [haveQuestions, setHaveQuestions] = useState(true);


  /** @state {bool} election have voters */
  const [haveVoters, setHaveVoters] = useState(true);

  /** @state {bool} election have obscure state */
  const [obscureVoter, setObscureVoter] = useState(true);

  /** @state {bool} election private */
  const [privateElection, setPrivateElection] = useState(true);

  /** @state {bool} election have audit */
  const [totalVoters, setTotalVoters] = useState(0);

  const [totalVotes, setTotalVotes] = useState(0);

  /** @state {bool} election have audit */
  const [randomizeAnswers, setRandomizeAnswers] = useState(true);

  /** @state {bool} election have trustee */
  const [haveTrustee, setHaveTrustee] = useState(true);

  /** @state {string} title of election */
  const [titleElection, setTitleElection] = useState("");

  /** @state {string} election type */
  const [typeElection, setTypeElection] = useState("");

  /** @state {bool} state modal freeze */
  const [freezeModal, setFreezeModal] = useState(false);

  /** @state {bool} state modal close election */
  const [closeModal, setCloseModal] = useState(false);

  const [tallyModal, setTallyModal] = useState(false);

  const [combineTallyModal, setCombineTallyModal] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [typeFeedback, setTypeFeedback] = useState("");

  const [electionStatus, setElectionStatus] = useState("");

  const [trustees, setTrustees] = useState([]);

  const [load, setLoad] = useState(false);


  /** @state {bool} upload modal state */
  const [uploadModal, setUploadModal] = useState(false);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  const updateInfo = useCallback(()=>{
    /**
     * Get election and trustee info
     */
    getElection(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        setElectionStatus(jsonResponse.election_status);
        setTitleElection(jsonResponse.name);
        setHaveQuestions(jsonResponse.questions !== null);
        setHaveVoters(jsonResponse.voters.length > 0);
        setHaveTrustee(jsonResponse.trustees.length > 0);
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
      const { resp, jsonResponse } = res;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
    });
  }, []);

  useEffect(() => {
    updateInfo();
  }, [updateInfo]);

  return (
    <>
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <Title
              namePage="Panel de administración"
              nameElection={titleElection}
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
                {titleElection}
              </div>
              <hr />
              <div className="columns">
                <div className="column">
                  <CardSettings haveQuestions={haveQuestions} />
                  <CardSteps
                    uuid={uuid}
                    electionStatus={electionStatus}
                    haveVoters={haveVoters}
                    haveQuestions={haveQuestions}
                    haveTrustee={haveTrustee}
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
      </div>
    </>
  );
}

export default AdministrationPanel;
