import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import Title from "../../component/OthersComponents/Title";
import { useParams } from "react-router-dom";
import selectImg from "../../static/cabina/svg/select-img.svg";
import ElectionCode from "../../component/Footers/ElectionCode";
import InstructionsSection from "../../pages/Cabina/components/InstructionsSection";
import MediaSection from "../../pages/Cabina/components/MediaSection";
import Question from "./components/Question";
import ProgressBar from "./components/ProgressBar";
import React, { useState } from "react";

function Cabina() {
  const { uuid } = useParams();
  const questions = require("../../static/dummyData/questionCabina.json");
  const [begin, setBegin] = useState(false);

  return (
    <div id="content" class="parallax-01">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />
          <Title namePage="Cabina Votación" nameElection={"nameElection"} />
        </div>
      </section>
      {/* <ProgressBar></ProgressBar> */}
      {!begin ? (
        <>
          <MediaSection />
          <InstructionsSection
            beginAction={() => {
              console.log("begin");
              setBegin(true);
            }}
          />{" "}
        </>
      ) : (
        <>
          <ProgressBar phase={1} />
          <section className="section pb-0" id="question-section">
            <div className="container has-text-centered is-max-desktop">
              <Question questions={questions} />
            </div>
          </section>
        </>
      )}

      <ElectionCode uuid={uuid} />
      <div id="bottom"></div>
    </div>
  );
}

export default Cabina;
