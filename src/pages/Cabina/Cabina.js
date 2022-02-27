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

function Cabina() {
  const { uuid } = useParams();
  const questions = require("../../static/dummyData/questionCabina.json");
  const [actualPhase, setActualPhase] = useState(1);

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
                questions={questions}
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
          <AuditSection auditBack={() => {
              setActualPhase(2);
            }} />
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
