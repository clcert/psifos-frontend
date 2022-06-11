import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import Title from "../../../component/OthersComponents/Title";
import { useParams } from "react-router-dom";
import ElectionCode from "../../../component/Footers/ElectionCode";
import InstructionsSection from "./InstructionsSection/InstructionsSection";
import MediaSection from "./InstructionsSection/MediaSection";
import QuestionElection from "./QuestionSection/QuestionElection";
import ProgressBar from "../components/ProgressBar";
import React, { useState, useEffect } from "react";
import EncryptingCharging from "../components/EncryptingCharging";
import ReviewQuestions from "./Review/ReviewQuestions";
import CastDone from "../components/CastDone";
import AuditSection from "./Review/AuditSection";
import { backendIP } from "../../../server";
import BoothPsifos from "../BoothPsifos";

function CabinaElection(props) {
  /** @state {int} election phase */
  const [actualPhase, setActualPhase] = useState(1);

  /** @state {array} list with answers  */
  const [answers, setAnswers] = useState([]);

  /** @state {int} actual voter question  */
  const [actualQuestion, setActualQuestion] = useState(0);

  /** @state {array} election data (questions, key..)  */
  const [electionData, setElectionData] = useState([]);

  const [nameElection, setNameElection] = useState("");

  /** @state {array} list with questions  */
  const [questions, setQuestions] = useState([]);

  /** @urlParam {uuid} election uuid  */
  const { uuid } = useParams();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [actualPhase]);

  useEffect(() => {
    setElectionData(props.electionData);
    if (props.electionData.questions) {
      setQuestions(JSON.parse(props.electionData.questions));
      setNameElection(props.electionData.name);
    }
  }, [props.electionData]);

  let election_metadata = require("../../../static/dummyData/electionMetadata.json");
  let BOOTH_PSIFOS = new BoothPsifos(
    JSON.stringify(props.electionData),
    election_metadata
  );
  const phases = {
    1: {
      sectionClass: "parallax-01",
      stage: 1,
      component: (
        <>
          <MediaSection />
          <InstructionsSection
            beginAction={() => {
              setActualPhase(2);
            }}
          />{" "}
        </>
      ),
    },
    2: {
      sectionClass: "parallax-02",
      stage: 1,
      component: <></>,
    },
    3: {
      sectionClass: "parallax-03",
      stage: 2,
      component: (
        <>
          <EncryptingCharging />
        </>
      ),
    },
    4: {
      sectionClass: "parallax-03",
      stage: 2,
      component: (
        <>
          <ProgressBar phase={2} />
          <ReviewQuestions
            audit={() => {
              setActualPhase(6);
            }}
            answers={answers}
            questions={questions}
            changeAnswer={(question) => {
              setActualQuestion(question);
              setActualPhase(2);
            }}
            sendVote={() => {
              setActualPhase(5);
            }}
          />
        </>
      ),
    },
    5: {
      sectionClass: "parallax-03",
      stage: 3,
      component: (
        <>
          <ProgressBar phase={3} />
          <CastDone></CastDone>
        </>
      ),
    },
    6: {
      sectionClass: "parallax-03",
      stage: 3,
      component: (
        <>
          <AuditSection
            auditBack={() => {
              setActualPhase(2);
            }}
          />
        </>
      ),
    },
  };

  return (
    <div id="content" className={phases[actualPhase].sectionClass}>
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar adressExit={backendIP + "/vote/" + uuid + "/logout"} />
          <Title namePage="Cabina Votación" nameElection={nameElection} />
        </div>
      </section>

      <div
        style={{
          display: actualPhase === 2 ? "block" : "none",
        }}
      >
        <ProgressBar phase={phases[actualPhase].stage} />
        <section className="section pb-0" id="question-section">
          <div className="container has-text-centered is-max-desktop">
            <QuestionElection
              questions={questions}
              afterEncrypt={(answersQuestions) => {
                setAnswers(answersQuestions);
                setActualPhase(4);
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
    </div>
  );
}

export default CabinaElection;
