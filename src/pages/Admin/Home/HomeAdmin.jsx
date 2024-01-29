import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { useState } from "react";
import Tabs from "../component/Tabs";
import AccesoElecciones from "./AccesoElecciones";
import ResumenElecciones from "./ResumenElecciones";

function HomeAdmin() {
  const [actualTab, setActualTab] = useState(0);
  const tabs = ["Acceso elecciones", "Resumen elecciones"];

  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body py-0 px-0 header-hero">
          <NavbarAdmin />
          <TitlePsifos namePage="Bienvenido(a) a Participa UChile DEV" />
        </div>
      </section>

      <section
        className="section d-flex justify-content-center is-flex is-vcentered is-centered mt-5 mb-0"
        id="accordion-section"
      >
        <div>
          <Tabs actualTab={actualTab} setActualTab={setActualTab} tabs={tabs} />
          <div className={actualTab !== 0 ? "d-none" : ""}>
            <AccesoElecciones />
          </div>
          <div className={actualTab !== 1 ? "d-none" : ""}>
            <ResumenElecciones />
          </div>
        </div>
      </section>
      <FooterParticipa message="Participa UChile - 2023 - Universidad de Chile" />
    </div>
  );
}

export default HomeAdmin;
