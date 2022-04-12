import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import Title from "../../component/OthersComponents/Title";
import { useParams } from "react-router-dom";
import ElectionCode from "../../component/Footers/ElectionCode";
import InstructionsSection from "./InstructionsSection/InstructionsSection";
import MediaSection from "./InstructionsSection/MediaSection";
import Question from "./QuestionSection/Question";
import ProgressBar from "./components/ProgressBar";
import React, { useState, useEffect } from "react";
import EncryptingCharging from "./components/EncryptingCharging";
import ReviewQuestions from "./Review/ReviewQuestions";
import CastDone from "./components/CastDone";
import AuditSection from "./Review/AuditSection";
import { BOOTH } from "../../static/cabina/js/booth";
import { BigInt } from "../../static/cabina/js/jscrypto/bigint";
import { USE_SJCL } from "../../static/cabina/js/jscrypto/bigint";
import { sjcl } from "../../static/cabina/js/jscrypto/sjcl";
import { BigIntDummy } from "../../static/cabina/js/jscrypto/bigintDummy.js";
import { raw_json } from "../../static/dummyData/questionsData";
import { backendIP } from "../../server";
import NoAuth from "./NoAuth";
import { useSearchParams } from "react-router-dom";

function Cabina() {
  const { uuid } = useParams();
  const [actualPhase, setActualPhase] = useState(1);
  const [answers, setAnswers] = useState([]);
  const [actualQuestion, setActualQuestion] = useState(0);
  const [load, setLoad] = useState(false);
  const [auth, setAuth] = useState(false);
  const [electionData, setElectionData] = useState([]);
  const [election, setElection] = useState([]);
  const [NoAuthMessage, setNoAuthMessage] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  function validateAllQuestions(answersQuestions) {
    for (let i = 0; i < answersQuestions.length; i++) {
      BOOTH.validate_question(i);
    }
  }

  function sendEncryp(answersQuestions) {
    BOOTH.ballot.answers = answersQuestions;
    validateAllQuestions(answersQuestions);
    BOOTH.seal_ballot();
  }

  useEffect(() => {
    if (searchParams.get("logout") === "true") {
      window.location.href = backendIP + "/vote/" + uuid;
    }

    async function test() {
      let url = backendIP + "/" + uuid + "/questions";
      const resp = await fetch(url, {
        method: "GET",
        credentials: "include",
      });
      try {
        const jsonResponse = await resp.json();
        setLoad(true);
        if (resp.status === 200) {
          setElectionData(jsonResponse.question);
          setAuth(true);
        } else {
          setNoAuthMessage(
            "La elección no exite o no estas habilitado para votar en ella"
          );
        }
      } catch (err) {
        setLoad(true);
        setNoAuthMessage(
          "La elección no exite o no estas habilitado para votar en ella"
        );
      }
    }
    test();
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [actualPhase]);

  if (USE_SJCL) {
    sjcl.random.startCollectors();
  }

  // // we're asynchronous if we have SJCL and Worker
  BOOTH.synchronous = !(USE_SJCL && window.Worker);

  // // we do in the browser only if it's asynchronous
  BigInt.in_browser = !BOOTH.synchronous;

  // // set up dummy bigint for fast parsing and serialization
  if (!BigInt.in_browser) BigInt = BigIntDummy;

  //BigInt.setup(BOOTH.so_lets_go, BOOTH.nojava);

  let election_metadata = require("../../static/dummyData/electionMetadata.json");

  BOOTH.election_metadata = election_metadata;
  BOOTH.setup_election(raw_json, election_metadata);
  const election_data = JSON.parse(raw_json);
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
            questions={electionData}
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

  if (!load) {
    return <>LOAD</>;
  } else if (!auth) {
    return <NoAuth message={NoAuthMessage}></NoAuth>;
  } else if (load) {
    return (
      <div id="content" className={phases[actualPhase].sectionClass}>
        <section className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar />
            <Title namePage="Cabina Votación" nameElection={"nameElection"} />
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
              <Question
                questions={electionData}
                afterEncrypt={(answersQuestions) => {
                  setAnswers(answersQuestions);
                  setActualPhase(4);
                }}
                nextQuestion={(num) => {
                  setActualQuestion(num);
                }}
                actualQuestion={actualQuestion}
                booth={BOOTH}
                encrypQuestions={(answersQuestions) => {
                  sendEncryp(answersQuestions);
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
}

export default Cabina;
