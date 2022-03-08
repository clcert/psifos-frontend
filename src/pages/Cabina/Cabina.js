import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import Title from "../../component/OthersComponents/Title";
import { useParams } from "react-router-dom";
import ElectionCode from "../../component/Footers/ElectionCode";
import InstructionsSection from "./InstructionsSection/InstructionsSection";
import MediaSection from "./InstructionsSection/MediaSection";
import Question from "./QuestionSection/Question";
import ProgressBar from "./components/ProgressBar";
import React, { useState } from "react";
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

function Cabina() {
  const { uuid } = useParams();
  //const questions = require("../../static/dummyData/questionCabina.json");
  const [actualPhase, setActualPhase] = useState(1);

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
  BOOTH.ballot.answers = [[0]];
  BOOTH.launch_async_encryption_answer(0);
  //BOOTH.wait_for_ciphertexts();
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
      component: (
        <>
          <ProgressBar phase={1} />
          <section className="section pb-0" id="question-section">
            <div className="container has-text-centered is-max-desktop">
              <Question
                finish={() => {
                  setActualPhase(4);
                }}
                questions={election_data.questions}
              />
            </div>
          </section>
        </>
      ),
    },
    3: {
      sectionClass: "parallax-03",
      stage: 2,
      component: (
        <>
          <ProgressBar phase={2} />
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
            finish={() => {
              setActualPhase(5);
            }}
            audit={() => {
              setActualPhase(6);
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
          <MyNavbar />
          <Title namePage="Cabina Votación" nameElection={"nameElection"} />
        </div>
      </section>
      {phases[actualPhase].component}

      <ElectionCode uuid={uuid} />
      <div id="bottom"></div>
    </div>
  );
}

export default Cabina;
