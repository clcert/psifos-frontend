import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStats } from "../../../services/election";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import VotesByTime from "./Sections/VotesByTime";
import InvalidLogginByTime from "./Sections/InvalidLogginByTime";
import LogginByTime from "./Sections/LogginByTime";
import Tabs from "../component/Tabs";

function Statistics() {
  /** @state {string} election name */
  const [electionName, setElectionName] = useState("");

  /** @urlParam {string} uuid of election */
  const { shortName } = useParams();

  const [actualTab, setActualTab] = useState(0);

  const tabs = ["Votos recibidos", "Ingresos recibidos", "Ingresos fallidos"];

  const initComponent = useCallback(() => {
    getStats(shortName).then((data) => {
      const { jsonResponse } = data;
      setElectionName(jsonResponse.name);
    });
  }, [shortName]);

  useEffect(() => {
    initComponent();
  }, [initComponent]);

  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />

          <TitlePsifos
            namePage="Estadisticas de la votación"
            nameElection={electionName}
          />
        </div>
      </section>

      <SubNavbar active={6} />

      <section
        className="section is-flex is-align-items-center is-flex-direction-column"
        id="results-section"
      >
        <div className="chart-container">
          <Tabs actualTab={actualTab} setActualTab={setActualTab} tabs={tabs} />
          <div className={actualTab !== 0 ? "d-none" : ""}>
            <VotesByTime />
          </div>
          <div className={actualTab !== 1 ? "d-none" : ""}>
            <LogginByTime />
          </div>
          <div className={actualTab !== 2 ? "d-none" : ""}>
            <InvalidLogginByTime />
          </div>
        </div>
      </section>

      <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
    </div>
  );
}

export default Statistics;
