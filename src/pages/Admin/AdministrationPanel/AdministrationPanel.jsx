import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import ExtendElection from "./component/ExtendElection";
import ModalFreeze from "./component/ModalFreeze";
import logout from "../../../utils/utils";
import ModalCloseElection from "./component/ModalCloseElection";
import { getElection } from "../../../services/election";
import ModalTally from "./component/ModalTally";
import ModalCombineTally from "./component/ModalCombineTally";
import CardInfo from "./component/CardInfo";
import CardSettings from "./component/CardSettings";
import CardSteps from "./component/CardSteps";
import UploadModal from "../Urna/components/UploadModal";

/**
 * Main view of the administrator panel where you can modify the parameters of an election
 */

function AdministrationPanel(props) {
  /** @state {bool} modal state to extend voting */
  const [extendElectionModal, setExtendElectionModal] = useState(false);

  /** @state {bool} election have questions */
  const [haveQuestions, setHaveQuestions] = useState(true);

  /** @state {bool} election have public keys */
  const [initElection, setInitElection] = useState(true);

  /** @state {bool} election have voters */
  const [haveVoters, setHaveVoters] = useState(true);

  /** @state {bool} election have obscure state */
  const [obscureVoter, setObscureVoter] = useState(true);

  /** @state {bool} election private */
  const [privateElection, setPrivateElection] = useState(true);

  /** @state {bool} election have audit */
  const [totalVoters, setTotalVoters] = useState(0);

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

  /** @state {bool} upload modal state */
  const [uploadModal, setUploadModal] = useState(false);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  function updateInfo() {
    /**
     * Get election and trustee info
     */
    getElection(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        setElectionStatus(jsonResponse.election_status);
        setTitleElection(jsonResponse.name);
        setHaveQuestions(jsonResponse.questions !== "");
        setInitElection(jsonResponse.public_key !== "");
        setHaveVoters(jsonResponse.voters.length > 0);
        setHaveTrustee(jsonResponse.trustees.length > 0);
        setTrustees(jsonResponse.trustees);
        setObscureVoter(jsonResponse.obscure_voter_names);
        setPrivateElection(jsonResponse.private_p);
        setRandomizeAnswers(jsonResponse.randomize_answer_order);
        setTotalVoters(jsonResponse.voters.length);
        setTypeElection(jsonResponse.election_type);
      } else if (resp.status === 401) {
        logout();
      }
    });
  }

  useEffect(() => {
    updateInfo();
  }, []);

  return (
    <>
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <Title
              namePage="Panel de administraci??n"
              nameElection={titleElection}
            />
          </div>
        </section>

        <SubNavbar active={1} />

        <section className="section mb-0 mt-3" id="accordion-section">
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
                  updateInfo={updateInfo}
                  typeElection={typeElection}
                  totalVoters={totalVoters}
                  obscureVoter={obscureVoter}
                  privateElection={privateElection}
                  randomizeAnswers={randomizeAnswers}
                  trustees={trustees}
                  electionStatus={electionStatus}
                />
              </div>
            </div>
          </div>
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
        <UploadModal show={uploadModal} onHide={() => setUploadModal(false)} />
      </div>
    </>
  );
}

export default AdministrationPanel;
