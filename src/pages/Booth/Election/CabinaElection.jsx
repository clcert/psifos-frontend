import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import { useParams } from "react-router-dom";
import ElectionCode from "../../../component/Footers/ElectionCode";
import QuestionElection from "./QuestionSection/QuestionElection";
import ProgressBar from "../components/ProgressBar";
import React, { useState, useEffect } from "react";
import EncryptingCharging from "../components/EncryptingCharging";
import ReviewQuestions from "./Review/ReviewQuestions";
import CastDone from "../components/CastDone";
import AuditSection from "./Review/AuditSection";
import { backendOpIP } from "../../../server";
import BoothPsifos from "../BoothPsifos";
import DescriptionModal from "../components/DescriptionModal";

function CabinaElection(props) {
  /** @state {int} election phase */
  const [actualPhase, setActualPhase] = useState(1);

  /** @state {array} list with answers  */
  const [answers, setAnswers] = useState([]);

  /** @state {int} actual voter question  */
  const [actualQuestion, setActualQuestion] = useState(0);

  const [nameElection, setNameElection] = useState("");

  /** @state {array} list with questions  */
  const [questions, setQuestions] = useState([]);

  /** @state {string} vote hash  */
  const [voteHash, setVoteHash] = useState("");

  const [voteVerificated, setVoteVerificates] = useState(null);

  const [modalVerify, setModalVerify] = useState(false);

  const [modalDescription, setModalDescription] = useState(false);

  /** @urlParam {uuid} election uuid  */
  const { uuid } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [actualPhase]);

  useEffect(() => {
    if (props.electionData.questions) {
      setQuestions(JSON.parse(props.electionData.questions));
      setNameElection(props.electionData.name);
    }
  }, [props.electionData]);

  useEffect(() => {
    if (props.electionData.description) setModalDescription(true);
  }, [props.electionData.description]);

  let election_metadata = require("../../../static/dummyData/electionMetadata.json");

  let BOOTH_PSIFOS = new BoothPsifos(
    JSON.stringify(props.electionData),
    election_metadata,
    props.preview
  );

  const phases = {
    1: {
      sectionClass: "parallax-02",
      stage: 1,
      component: <></>,
    },
    2: {
      sectionClass: "parallax-03",
      stage: 2,
      component: <EncryptingCharging />,
    },
    3: {
      sectionClass: "parallax-03",
      stage: 2,
      component: (
        <>
          <ProgressBar phase={2} />
          <ReviewQuestions
            audit={() => {
              setActualPhase(5);
            }}
            answers={answers}
            questions={questions}
            setVoteVerificates={setVoteVerificates}
            voteHash={voteHash}
            modalVerify={modalVerify}
            changeAnswer={(question) => {
              setActualQuestion(question);
              setActualPhase(1);
            }}
            sendVote={() => {
              BOOTH_PSIFOS.sendJson(uuid).then((res) => {
                setVoteHash(res);
                setModalVerify(true);
              });
            }}
            afterVerify={() => {
              setModalVerify(false);
              setActualPhase(4);
            }}
          />
        </>
      ),
    },

    4: {
      sectionClass: "parallax-05",
      stage: 3,
      component: (
        <>
          <ProgressBar phase={3} />
          <CastDone
            voteVerificated={voteVerificated}
            voteHash={voteHash}
          ></CastDone>
        </>
      ),
    },
    5: {
      sectionClass: "parallax-03",
      stage: 4,
      component: (
        <AuditSection
          auditBack={() => {
            setActualPhase(1);
          }}
        />
      ),
    },
  };

  return (
    <div id="content" className={phases[actualPhase].sectionClass}>
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar
            linkExit={backendOpIP + "/vote/" + uuid + "/logout"}
            linkInit=""
          />
          <TitlePsifos
            namePage={
              props.preview
                ? "Previsualización de votación"
                : "Cabina de Votación"
            }
            nameElection={nameElection}
          />
        </div>
      </section>

      <div
        style={{
          display: actualPhase === 1 ? "block" : "none",
        }}
      >
        <ProgressBar phase={phases[actualPhase].stage} />
        <section className="section pb-1" id="question-section">
          <div className="container has-text-centered is-max-desktop">
            <QuestionElection
              questions={questions}
              afterEncrypt={(answersQuestions) => {
                setAnswers(answersQuestions);
                setActualPhase(3);
              }}
              nextQuestion={(num) => {
                setActualQuestion(num);
              }}
              actualQuestion={actualQuestion}
              booth={BOOTH_PSIFOS.getBooth()}
              encrypQuestions={(answersQuestions) => {
                BOOTH_PSIFOS.sendEncryp(answersQuestions);
              }}
            />
          </div>
        </section>
      </div>
      {phases[actualPhase].component}

      <ElectionCode uuid={uuid} />
      <div id="bottom"></div>
      <DescriptionModal
        election={props.electionData}
        show={modalDescription}
        onHide={() => setModalDescription(false)}
      />
    </div>
  );
}

export default CabinaElection;
