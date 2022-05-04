import { Button } from "react-bulma-components";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import AccordionAudit from "./component/AccordionAudit";
import ExtendElection from "./component/ExtendElection";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { backendIP } from "../../../server";
import ModalFreeze from "./component/ModalFreeze";

/**
 * Main view of the administrator panel where you can modify the parameters of an election
 */

function AdministrationPanel(props) {
  /** @state {bool} modal state to extend voting */
  const [extendElectionModal, setExtendElectionModal] = useState(false);

  /** @state {bool} election have questions */
  const [haveQuestions, setHaveQuestions] = useState(true);

  /** @state {bool} election have public keys */
  const [havePublicKeys, setHavePublicKeys] = useState(true);

  /** @state {bool} election have voters */
  const [haveVoters, setHaveVoters] = useState(true);

  /** @state {bool} election have obscure state */
  const [obscureVoter, setObscureVoter] = useState(true);

  /** @state {bool} election private */
  const [privateElection, setPrivateElection] = useState(true);

  /** @state {bool} election have audit */
  const [totalVoters, setTotalVoters] = useState(0);

  /** @state {bool} election have audit */
  const [randomizeAnswers, setRandomizeAnswers] = useState(true);

  /** @state {bool} election have trustee */
  const [haveTrustee, setHaveTrustee] = useState(true);

  /** @state {string} title of election */
  const [titleElection, setTitleElection] = useState("");

  /** @state {string} election type */
  const [typeElection, setTypeElection] = useState("");

  /** @state {bool} state modal freeze */
  const [freezeModal, setFreezeModal] = useState(false);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    async function getElection() {
      /**
       * async function to get the election data
       */

      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendIP + "/get_election/" + uuid, {
        method: "GET",
        headers: {
          "x-access-tokens": token,
          "Content-Type": "application/json",
        },
      });
      const jsonResponse = await resp.json();
      setTitleElection(jsonResponse.name);
      setHaveQuestions(jsonResponse.questions.length > 0);
      setHavePublicKeys(jsonResponse.public_keys !== "");
      setHaveVoters(jsonResponse.voters.length > 0);
      setHaveTrustee(jsonResponse.trustees.length > 0);
      setObscureVoter(jsonResponse.obscure_voter_names);
      setPrivateElection(jsonResponse.private_p);
      setRandomizeAnswers(jsonResponse.randomize_answer_order);
      setTotalVoters(jsonResponse.voters.length);
      setTypeElection(jsonResponse.election_type);
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
              namePage="Panel de administración"
              nameElection={titleElection}
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
            <hr />
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
                <span className="panel-text-sect">Tipo de votación</span>:{" "}
                {typeElection === "Election" ? "Elección" : "Consulta"}
              </p>

              <p className="panel-text">
                <span className="panel-text-sect">Cantidad de votantes</span>:{" "}
                {totalVoters}
              </p>

              <p className="panel-text">
                <span className="panel-text-sect">
                  Esconder nombre de los votantes:{" "}
                </span>
                {obscureVoter ? (
                  <i className="fa-solid fa-check" />
                ) : (
                  <i className="fa-solid fa-x" />
                )}
              </p>

              <p className="panel-text">
                <span className="panel-text-sect">Elección privada</span>:{" "}
                {privateElection ? (
                  <i className="fa-solid fa-check" />
                ) : (
                  <i className="fa-solid fa-x" />
                )}
              </p>

              <p className="panel-text">
                <span className="panel-text-sect">Aleatorizar respuestas</span>:{" "}
                {randomizeAnswers ? (
                  <i className="fa-solid fa-check" />
                ) : (
                  <i className="fa-solid fa-x" />
                )}
              </p>

              <p className="panel-text">
                <span className="panel-text-sect">Proximos pasos</span>:
              </p>

              <ul>
                {!haveVoters && (
                  <p className="panel-text">
                    <span className="panel-text-sect">
                      <Link to={"/admin/" + uuid + "/urna"}>
                        Añadir votantes
                      </Link>
                    </span>
                  </p>
                )}
                {!haveQuestions && (
                  <p className="panel-text">
                    <span className="panel-text-sect">
                      <Link to={"/admin/createQuestion/" + uuid}>
                        Añadir Preguntas
                      </Link>
                    </span>
                  </p>
                )}
                {!haveTrustee && (
                  <p className="panel-text">
                    <span className="panel-text-sect">
                      <Link to={"/admin/" + uuid + "/custodio"}>
                        Añadir Custodios
                      </Link>
                    </span>
                  </p>
                )}
                {/* {true && !haveVoters &&
                  !haveQuestions &&
                  !havePublicKeys && */}
                {/* !haveTrustee( */}
                <p className="panel-text">
                  <span
                    onClick={() => setFreezeModal(true)}
                    className="panel-text-sect"
                  >
                    Freeze ballot
                  </span>
                </p>
              </ul>
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
        <ModalFreeze
          show={freezeModal}
          onHide={() => setFreezeModal(false)}
          uuid={uuid}
        />
      </div>
    </>
  );
}

export default AdministrationPanel;
