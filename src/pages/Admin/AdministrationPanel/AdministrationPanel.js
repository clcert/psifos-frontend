import { Button } from "react-bulma-components";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import AccordionAudit from "./component/AccordionAudit";
import ExtendElection from "./component/ExtendElection";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useParams } from "react-router-dom";
import { backendIP } from "../../../server";

function AdministrationPanel(props) {
  const [extendElectionModal, setExtendElectionModal] = useState(false);
  const [votingStartDate, setVotingStartDate] = useState("");
  const [votingEndDate, setVotingEndDate] = useState("");
  const [titleElection, setTitleElection] = useState("");
  const { uuid } = useParams();

  useEffect(() => {
    async function getElection() {
      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendIP + "/get_election/" + uuid, {
        method: "GET",
        headers: {
          "x-access-tokens": token,
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await resp.json();
      setVotingStartDate(
        jsonResponse.voting_started_at.split("T")[0] +
          " " +
          jsonResponse.voting_started_at.split("T")[1]
      );
      setVotingEndDate(
        jsonResponse.voting_ends_at.split("T")[0] +
          " " +
          jsonResponse.voting_ends_at.split("T")[1]
      );
      setTitleElection(jsonResponse.name);
    }
    getElection();
  }, []);

  return (
    <>
      <div id="content-home-admin">
        <section id="header-section" className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <NavbarAdmin />
            <Title
              namePage="Bienvenido a Participa Uchile DEV"
              nameElection={"Elección creada por Helios Admin"}
            />
          </div>
        </section>

        <SubNavbar active={1} />

        <section
          className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
          id="accordion-section"
        >
          <div className="panel-body">
            <div className="has-text-centered title is-size-4-mobile">
              {titleElection}
            </div>
            <hr/>
            <div className="panel-action mb-4">
              <Link to={"/admin/editElection/" + uuid}>
                <Button className="button-custom mr-2 ml-2"> Editar</Button>
              </Link>
              <Button className="button-custom mr-2 ml-2">Archivar</Button>
              <Button className="button-custom mr-2 ml-2">Copiar</Button>
              <Button
                className="button-custom mr-2 ml-2"
                onClick={() => {
                  setExtendElectionModal(true);
                }}
              >
                Extender votación
              </Button>
              <Link to={"/admin/createQuestion/" + uuid}>
                <Button className="button-custom mr-2 ml-2">Preguntas</Button>
              </Link>
            </div>

            <div className="panel-info mb-4">
              <p className="panel-text">
                <span className="panel-text-sect">Estado</span>: Activa
              </p>
              <p className="panel-text">
                <span className="panel-text-sect">Fecha inicio</span>:{" "}
                {votingStartDate ? votingStartDate : "No definida"}
              </p>
              <p className="panel-text">
                <span className="panel-text-sect">Fecha termino</span>:{" "}
                {votingEndDate ? votingEndDate : "No definida"}
              </p>
              <p className="panel-text">
                <span className="panel-text-sect">Proximo paso</span>: Añadir
                preguntas...
              </p>
            </div>

            <div className="panel-audit">
              <AccordionAudit />
            </div>
          </div>
        </section>
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
        <ExtendElection
          show={extendElectionModal}
          onHide={() => setExtendElectionModal(false)}
        />
      </div>
    </>
  );
}

export default AdministrationPanel;
