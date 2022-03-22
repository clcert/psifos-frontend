import Title from "../../../component/OthersComponents/Title";
import Accordion from "./component/Accordion";
import { Button } from "react-bulma-components";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { backendIP } from "../../../server";

function HomeAdmin(props) {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    async function getElections() {
      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendIP + "/get_elections", {
        method: "GET",
        headers: {
          "x-access-tokens": token,
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await resp.json();
      setElections(jsonResponse);
    }
    getElections();
  }, []);

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
                <Link
                  style={{ textDecoration: "none", color: "white" }}
                  className="link-button"
                  to="/admin/createElection"
                >
                  Crear Votación
                </Link>
              </Button>
            </div>
          </div>
          <div className="home-admin-accordion-section">
            {Object.keys(elections).map((key) => {
              return (
                <Accordion
                  state="En curso"
                  electionName={elections[key].short_name}
                  uuid={elections[key].uuid}
                />
              );
            })}
          </div>
        </div>
      </section>
      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default HomeAdmin;
