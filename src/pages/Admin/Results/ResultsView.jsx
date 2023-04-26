import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import SubNavbar from "../component/SubNavbar";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { getStats } from "../../../services/election";
import Results from "./components/Results";

function Resultados() {
  /**
   * View for results of an election
   */

  /** @state {string} name election */
  const [electionName, setElectionName] = useState("");

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  useEffect(() => {
    getStats(shortName).then((data) => {
      const { jsonResponse } = data;
      setElectionName(jsonResponse.name);
    });
  });

  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />

          <TitlePsifos
            namePage="Resultados Preliminares"
            nameElection={electionName}
          />
        </div>
      </section>

      <SubNavbar active={5} />

      <section
        className="section is-flex is-align-items-center is-flex-direction-column"
        id="results-section"
      >
        <Results />
      </section>

      <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
    </div>
  );
}

export default Resultados;
