import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStats } from "../../../services/election";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import VotesByTime from "./Sections/VotesByTime";

function Statistics() {
  /** @state {string} election name */
  const [electionName, setElectionName] = useState("");

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    getStats(uuid).then((data) => {
      const { jsonResponse } = data;
      setElectionName(jsonResponse.name);
    });
  }, []);

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
        <div className="has-text-centered title is-size-4-mobile">
          Cantidad de votos por tiempo
        </div>
        <VotesByTime />
      </section>

      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default Statistics;
