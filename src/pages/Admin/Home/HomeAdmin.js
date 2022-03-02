import Title from "../../../component/OthersComponents/Title";
import MyNavbar from "../../../component/ShortNavBar/MyNavbar";
import Accordion from "./component/Accordion";
import { Button } from "react-bulma-components";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { Link } from "react-router-dom";

function HomeAdmin(props) {
  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body py-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Bienvenido a Participa Uchile DEV" />
        </div>
      </section>

      <section
        className="section columns is-flex is-vcentered is-centered mt-5 mb-0"
        id="accordion-section"
      >
        <div className="home-admin-principal">
          <div className="header-accordion mb-4 level">
            <div className="level-left">
              <input
                className="home-admin-search level-item"
                type="text"
                placeholder="Buscar"
              />
            </div>
            <div className="level-right">
              <Button
                className="button-custom ml-3 home-admin-button level-item"
                onClick={() => {
                  window.location.href = "";
                }}
              >
                <Link className="link-button" to="/admin/createElection" >Crear Votación</Link>
              </Button>
            </div>
          </div>
          <div className="home-admin-accordion-section">
            <Accordion state="En curso" electionName="Elección 1" />
            <Accordion state="Terminada" electionName="Elección 2" />
            <Accordion state="Inicio pronto" electionName="Elección 3" />
          </div>
        </div>
      </section>
      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default HomeAdmin;
