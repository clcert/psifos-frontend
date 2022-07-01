import { Button } from "react-bulma-components";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import AccordionAudit from "./component/AccordionAudit";
import ExtendElection from "./component/ExtendElection";
import ModalFreeze from "./component/ModalFreeze";
import logout from "../../../utils/utils";
import ModalCloseElection from "./component/ModalCloseElection";
import { getElection } from "../../../services/election";
import ModalTally from "./component/ModalTally";

/**
 * Main view of the administrator panel where you can modify the parameters of an election
 */

function AdministrationPanel(props) {
  /** @state {bool} modal state to extend voting */
  const [extendElectionModal, setExtendElectionModal] = useState(false);

  /** @state {bool} election have questions */
  const [haveQuestions, setHaveQuestions] = useState(true);

  /** @state {bool} election have public keys */
  const [initElection, setInitElection] = useState(true);

  const [closeElection, setCloseElection] = useState(false);

  const [tallyCompute, setTallyCompute] = useState(false);

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

  /** @state {bool} state modal close election */
  const [closeModal, setCloseModal] = useState(false);

  const [tallyModal, setTallyModal] = useState(false);

  const [feedbackMessage, setFeedbackMessage] = useState("");

  const [typeFeedback, setTypeFeedback] = useState("");

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    getElection(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        setTitleElection(jsonResponse.name);
        setHaveQuestions(jsonResponse.questions !== "");
        setInitElection(jsonResponse.public_key !== "");
        setHaveVoters(jsonResponse.voters.length > 0);
        setHaveTrustee(jsonResponse.trustees.length > 0);
        setObscureVoter(jsonResponse.obscure_voter_names);
        setPrivateElection(jsonResponse.private_p);
        setRandomizeAnswers(jsonResponse.randomize_answer_order);
        setTotalVoters(jsonResponse.voters.length);
        setTypeElection(jsonResponse.election_type);
        setCloseElection(jsonResponse.voting_ended_at !== null);
        setTallyCompute(jsonResponse.encrypted_tally !== "");
      } else if (resp.status === 401) {
        logout();
      }
    });
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
            {feedbackMessage && (
              <div className={"notification is-primary " + typeFeedback}>
                <button
                  className="delete"
                  onClick={() => setFeedbackMessage("")}
                ></button>
                {feedbackMessage}
              </div>
            )}

            <div className="has-text-centered title is-size-4-mobile">
              {titleElection}
            </div>
            <hr />

            <div className="panel-action mb-4">
              <Link to={"/admin/" + uuid + "/edit-election/"}>
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
              <Link to={"/admin/" + uuid + "/create-question/"}>
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
                      <Link to={"/admin/" + uuid + "/create-question/"}>
                        Añadir Preguntas
                      </Link>
                    </span>
                  </p>
                )}
                {!haveTrustee && (
                  <p className="panel-text">
                    <span className="panel-text-sect">
                      <Link to={"/admin/" + uuid + "/trustee"}>
                        Añadir Custodios
                      </Link>
                    </span>
                  </p>
                )}

                {haveVoters && haveQuestions && haveTrustee && !initElection && (
                  <p className="panel-text">
                    <span
                      onClick={() => setFreezeModal(true)}
                      className="panel-text-sect"
                    >
                      <Link to="">Iniciar elección</Link>
                    </span>
                  </p>
                )}

                {haveVoters &&
                  haveQuestions &&
                  haveTrustee &&
                  initElection &&
                  !closeElection && (
                    <p className="panel-text">
                      <span
                        onClick={() => setCloseModal(true)}
                        className="panel-text-sect"
                      >
                        <Link to="">Cerrar elección</Link>
                      </span>
                    </p>
                  )}
                {haveVoters &&
                  haveQuestions &&
                  haveTrustee &&
                  initElection &&
                  closeElection && 
                  !tallyCompute &&  (
                    <p className="panel-text">
                      <span
                        onClick={() => setTallyModal(true)}
                        className="panel-text-sect"
                      >
                        <Link to="">Computar Tally</Link>
                      </span>
                    </p>
                  )}
                  {haveVoters &&
                  haveQuestions &&
                  haveTrustee &&
                  initElection &&
                  closeElection && 
                  tallyCompute &&  (
                    <p className="panel-text">
                      <span
                        className="panel-text-sect"
                      >
                        <Link to="">Esperando desencriptaciones parciales</Link>
                      </span>
                    </p>
                  )}
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
          freezeChange={(newValue) => setInitElection(newValue)}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={uuid}
        />
        <ModalCloseElection
          show={closeModal}
          onHide={() => setCloseModal(false)}
          endChange={(newValue) => setCloseElection(newValue)}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={uuid}
        />

        <ModalTally
          show={tallyModal}
          onHide={() => setTallyModal(false)}
          tallyChange={(newValue) => setTallyCompute(newValue)}
          feedback={(message, type) => {
            setFeedbackMessage(message);
            setTypeFeedback(type);
          }}
          uuid={uuid}
        />
      </div>
    </>
  );
}

export default AdministrationPanel;
