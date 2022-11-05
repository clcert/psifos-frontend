import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendOpIP } from "../../../server";
import { getStats } from "../../../services/election";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import LinePsifosGraph from "./Graphs/LinePsifosGraph";

function Statistics() {
  const { uuid } = useParams();
  const [electionName, setElectionName] = useState("");
  const [votesForTime, setVotesForTime] = useState({});
  const [deltaTime, setDeltaTime] = useState(60);

  async function getCountDates() {
    const token = sessionStorage.getItem("token");
    const resp = await fetch(backendOpIP + "/" + uuid + "/count-dates", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        minutes: deltaTime,
      }),
    });
    if (resp.status === 200) {
      const jsonResponse = await resp.json();
      setVotesForTime(jsonResponse);
    }
  }

  useEffect(() => {
    getStats(uuid).then((data) => {
      setElectionName(data.short_name);
    });
    getCountDates();
  }, []);

  useEffect(() => {
    getCountDates();
  }, [deltaTime]);

  function handleChange(event) {
    setDeltaTime(parseInt(event.target.value));
  }

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
        {Object.keys(votesForTime).length !== 0 ? (
          <div className="chart-container" style={{ overflowX: "auto" }}>
            <label for="pet-select">Variación de tiempo:</label>

            <select
              onChange={handleChange}
              name="delta-time"
              id="time"
              value={deltaTime}
            >
              <option value="">--Eliga una opción--</option>
              <option value="30">30 Minutos</option>
              <option value="60">60 Minutos</option>
              <option value="120">2 Horas</option>
              <option value="240">4 Horas</option>
              <option value="1440">1 Día</option>
            </select>
            <LinePsifosGraph data={votesForTime} />
          </div>
        ) : (
          <div className="spinner-animation"></div>
        )}
      </section>

      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default Statistics;
