import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { useState, useEffect } from "react";
import { backendOpIP } from "../../../server";
import SubNavbar from "../component/SubNavbar";
import { getElection } from "../../../services/election";

function CreateElection(props) {
  /**
   * view that handles the creation of a election
   */

  /** @state {string} short name for election */
  const [shortName, setShortName] = useState("");

  /** @state {string} title of election */
  const [name, setName] = useState("");

  /** @state {string} description of election */
  const [description, setDescription] = useState("");

  /** @state {string} date for start election */
  const [electionType, setElectionType] = useState("election");

  /** @state {number} max weight for election */
  const [maxWeight, setMaxWeight] = useState(1);

  /** @state {boolean} indicates if the election has aliases  */
  const [voterAliases, setVoterAliases] = useState(false);

  /** @state {boolean} indicates if the election has randomize  */
  const [randomizeAnswer, setRandomizeAnswer] = useState(false);

  /** @state {boolean} indicates if the election is private  */
  const [privateElection, setPrivateElection] = useState(false);

  /** @state {boolean} indicates if normalize the election  */
  const [normalization, setNormalization] = useState(false);

  /** @state {string} alert message  */
  const [alertMessage, setAlertMessage] = useState("");

  const [disabledEdit, setDisabledEdit] = useState("");

  /** @urlParam {string} uuid of election  */
  const { uuid } = useParams();

  useEffect(() => {
    if (props.edit) {
      getElection(uuid).then((election) => {
        const { resp, jsonResponse } = election;
        if (resp.status === 200) {
          setDisabledEdit(jsonResponse.election_status !== "Setting up");
          setShortName(jsonResponse.short_name);
          setName(jsonResponse.name);
          setDescription(jsonResponse.description);
          setElectionType(jsonResponse.election_type.toLocaleLowerCase());
          setMaxWeight(jsonResponse.max_weight);
          setVoterAliases(jsonResponse.obscure_voter_names);
          setRandomizeAnswer(jsonResponse.randomize_answer_order);
          setPrivateElection(jsonResponse.private_p);
          setNormalization(jsonResponse.normalization);
        } else {
          setAlertMessage(jsonResponse.message);
        }
      });
    }
  }, [props.edit, uuid]);

  async function sendElection(url) {
    /**
     * async function to send and create a election
     */
    if (checkData()) {
      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendOpIP + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          short_name: shortName,
          name: name,
          description: description,
          election_type: electionType,
          max_weight: maxWeight,
          obscure_voter_names: voterAliases,
          randomize_answer_order: randomizeAnswer,
          private_p: privateElection,
          normalization: normalization,
        }),
      });
      const jsonResponse = await resp.json();
      if (resp.status === 400) {
        if (jsonResponse.message.hasOwnProperty("short_name")) {
          setAlertMessage(jsonResponse.message["short_name"][0]);
        }
      }
      if (resp.status === 201) {
        window.location.href = "/psifos/admin/" + jsonResponse.uuid + "/panel";
      }
    } else {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  }

  function checkData() {
    /**
     * function to check if the jsonResponse is correct
     */

    if (shortName.length === 0 || shortName.length > 100) {
      setAlertMessage("El nombre corto debe tener entre 1 y 100 caracteres");
      return false;
    } else if (name.length === 0 || name.length > 250) {
      setAlertMessage(
        "El nombre de la elección debe tener entre 1 y 250 caracteres"
      );
      return false;
    }
    return true;
  }

  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <TitlePsifos namePage="Creación de Elección" />
        </div>
      </section>

      {props.edit && <SubNavbar active={1} />}

      <section
        className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
        id="create-election-section"
      >
        <div className="body-content">
          {alertMessage.length > 0 && (
            <div className="notification is-danger is-light">
              <button
                className="delete"
                onClick={() => {
                  setAlertMessage("");
                }}
              ></button>
              {alertMessage}
            </div>
          )}

          <div className="field">
            <label className="label label-form-election">Nombre corto</label>
            <div className="control">
              <input
                disabled={disabledEdit}
                className="input"
                type="text"
                placeholder="Nombre corto"
                value={shortName}
                onChange={(e) => {
                  setShortName(e.target.value);
                }}
                maxLength="100"
              />
            </div>
            <p className="help">
              No espacios, esta sera parte de la URL, e.g. my-club-2010
            </p>
          </div>
          <div className="field">
            <label className="label label-form-election">
              Nombre de la elección
            </label>
            <div className="control">
              <input
                disabled={disabledEdit}
                className="input"
                type="text"
                placeholder="Nombre de la elección"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
            <p className="help">
              El nombre bonito para su elección, e.g Elecciones de Mi Club 2010
            </p>
          </div>
          <div className="field">
            <label className="label label-form-election">Descripción</label>
            <div className="control">
              <textarea
                disabled={disabledEdit}
                className="textarea"
                placeholder="Descripción"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              ></textarea>
            </div>
          </div>
          <div className="field">
            <label className="label label-form-election">
              Tipo de elección
            </label>
            <div className="control">
              <div className="select">
                <select
                  disabled={disabledEdit}
                  value={electionType}
                  onChange={(e) => {
                    setElectionType(e.target.value);
                  }}
                >
                  <option value="election">Elección</option>
                  <option value="query">Consulta</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label label-form-election">
              Peso maximo de los votantes
            </label>
            <div className="control">
              <input
                disabled={disabledEdit}
                className="input"
                type="number"
                placeholder="Peso maximo"
                value={maxWeight}
                onChange={(e) => {
                  setMaxWeight(e.target.value);
                }}
              />
            </div>
            <p className="help">The maximum value of the voter weights.</p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  disabled={disabledEdit}
                  onChange={(e) => {
                    setVoterAliases(e.target.checked);
                  }}
                  checked={voterAliases}
                  type="checkbox"
                  className="mr-2"
                />
                Esconder nombres de los votantes
              </label>
            </div>
            <p className="help">
              If selected, voter identities will be replaced with aliases, e.g.
              "V12", in the ballot tracking center
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  disabled={disabledEdit}
                  onChange={(e) => {
                    setRandomizeAnswer(e.target.checked);
                  }}
                  checked={randomizeAnswer}
                  type="checkbox"
                  className="mr-2"
                />
                Aleatorizar el orden de las respuestas
              </label>
            </div>
            <p className="help">
              Actívelo si desea que las respuestas a las preguntas aparezcan en
              orden aleatorio para cada votante
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  disabled={disabledEdit}
                  onChange={(e) => {
                    setPrivateElection(e.target.checked);
                  }}
                  checked={privateElection}
                  type="checkbox"
                  className="mr-2"
                />
                Elección privada
              </label>
            </div>
            <p className="help">
              Una elección privada solo es visible para los votantes
              registrados.
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  disabled={disabledEdit}
                  onChange={(e) => {
                    setNormalization(e.target.checked);
                  }}
                  checked={normalization}
                  type="checkbox"
                  className="mr-2"
                />
                Normalizar los resultados
              </label>
            </div>
            <p className="help">
              Los números de resultados que se muestran se dividen por el peso
              máximo de votantes
            </p>
          </div>
          <div className="level">
            <Link
              className="link-button"
              style={{ color: "white" }}
              to={
                props.edit
                  ? "/psifos/admin/" + uuid + "/panel"
                  : "/psifos/admin/home"
              }
            >
              <Button className="button-custom mr-2 ml-2 level-left">
                Atras
              </Button>
            </Link>
            {props.edit ? (
              <Button
                disabled={disabledEdit}
                onClick={() => {
                  sendElection("/edit-election/" + uuid);
                }}
                className="button-custom mr-2 ml-2 level-right"
              >
                Editar Elección
              </Button>
            ) : (
              <Button
                onClick={() => {
                  sendElection("/create-election");
                }}
                className="button-custom mr-2 ml-2 level-right"
              >
                Crear elección
              </Button>
            )}
          </div>
        </div>
      </section>
      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}
export default CreateElection;
