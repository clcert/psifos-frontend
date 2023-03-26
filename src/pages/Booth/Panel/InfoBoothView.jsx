import { useEffect } from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import { getElectionPublic } from "../../../services/election";
import Results from "../../Admin/Results/components/Results";
import CastVoteView from "./CastVoteView";
import SubNavbarBooth from "./components/SubNavbarBooth";
import LoggerBoth from "./LoggerBooth";
import StatisticsBooth from "./StatisticsBooth";
import VerifyElection from "./VerifyElection";

function InfoBoothView() {
  const [electionName, setElectionName] = useState("");
  const [activeNumber, setActiveNumber] = useState(0);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    getElectionPublic(uuid).then((data) => {
      const { jsonResponse } = data;
      setElectionName(jsonResponse.name);
    });
  });

  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar linkExit="" linkInit="" />

          <TitlePsifos
            namePage="Portal de Información"
            nameElection={electionName}
          />
        </div>
      </section>

      <SubNavbarBooth
        active={activeNumber}
        changeActive={(number, name) => {
          setActiveNumber(number);
        }}
      />

      <section
        className="section is-flex is-align-items-center is-flex-direction-column"
        id="results-section"
      >
        {activeNumber === 0 && <CastVoteView />}
        {activeNumber === 1 && <StatisticsBooth />}
        {activeNumber === 2 && <Results />}
        {activeNumber === 3 && <VerifyElection />}
        {activeNumber === 4 && <LoggerBoth />}
      </section>

      <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
    </div>
  );
}

export default InfoBoothView;
