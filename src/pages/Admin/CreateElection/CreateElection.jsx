import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { useState, useEffect } from "react";
import { backendOpIP } from "../../../server";
import SubNavbar from "../component/SubNavbar";
import AlertNotification from "../component/AlertNotification";
import { getElection } from "../../../services/election";

function AsteriskRequiredField() {
  return <span className="asterisk-required-field">*</span>;
}

function CreateElection(props) {
  /**
   * view that handles the creation of a election
   */

  /** @state {string} short name for election */
  const [electionParams, setElectionParams] = useState({
    short_name: "",
    name: "",
    description: "",
    election_type: "election",
    max_weight: 1,
    obscure_voter_names: false,
    randomize_answer_order: false,
    private_p: false,
    normalization: false,
    grouped: false,
  });

  /** @state {string} alert message  */
  const [alertMessage, setAlertMessage] = useState("");

  const [disabledEdit, setDisabledEdit] = useState("");

  /** @urlParam {string} shortName of election  */
  const { shortName } = useParams();

  useEffect(() => {
    if (props.edit) {
      getElection(shortName).then((election) => {
        const { resp, jsonResponse } = election;
        if (resp.status === 200) {
          setDisabledEdit(jsonResponse.election_status !== "Setting up");
          const params = {
            short_name: jsonResponse.short_name,
            name: jsonResponse.name,
            description: jsonResponse.description,
            election_type: jsonResponse.election_type.toLocaleLowerCase(),
            max_weight: jsonResponse.max_weight,
            obscure_voter_names: jsonResponse.obscure_voter_names,
            randomize_answer_order: jsonResponse.randomize_answer_order,
            private_p: jsonResponse.private_p,
            normalization: jsonResponse.normalization,
            grouped: jsonResponse.grouped,
          };
          setElectionParams(params);
        } else {
          setAlertMessage(jsonResponse.message);
        }
      });
    }
  }, [props.edit, shortName]);

  async function sendElection(url) {
    /**
     * async function to send and create a election
     */
    if (checkData()) {
      const token = localStorage.getItem("token");
      const resp = await fetch(backendOpIP + url, {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(electionParams),
      });
      const jsonResponse = await resp.json();
      if (resp.status === 404) {
        if (jsonResponse.detail === "The election already exists.") {
          setAlertMessage(`La elección ${electionParams.short_name} ya existe`);
          upScreen();
        }
      }
      if (resp.status === 201) {
        window.location.href =
          "/psifos/admin/" + electionParams.short_name + "/panel";
      }
    } else {
      upScreen();
    }
  }

  function upScreen() {
    /**
     * Scroll screen to the top
     */
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function checkData() {
    /**
     * function to check if the jsonResponse is correct
     */

    if (
      electionParams.short_name.length === 0 ||
      electionParams.short_name.length > 100
    ) {
      setAlertMessage("El nombre corto debe tener entre 1 y 100 caracteres");
      return false;
    } else if (electionParams.short_name.includes(" ")) {
      setAlertMessage(
        "El nombre de la elección no puede tener espacios en blanco"
      );
      return false;
    } else if (
      electionParams.name.length === 0 ||
      electionParams.name.length > 250
    ) {
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
          <TitlePsifos namePage="Crear votación" />
        </div>
      </section>

      {props.edit && <SubNavbar active={1} />}

      <section
        className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
        id="create-election-section"
      >
        <div className="body-content">
          {alertMessage.length > 0 && (
            <AlertNotification
              alertMessage={alertMessage}
              onClear={() => {
                setAlertMessage("");
              }}
            />
          )}
          <div className="field">
            <label className="label label-form-election">
              Nombre corto
              <AsteriskRequiredField />
            </label>
            <div className="control">
              <input
                id="input-short-name"
                disabled={disabledEdit}
                className="input"
                type="text"
                placeholder="Nombre corto"
                value={electionParams.short_name}
                onChange={(e) => {
                  setElectionParams({
                    ...electionParams,
                    short_name: e.target.value,
                  });
                }}
                maxLength="100"
              />
            </div>
            <p className="help">
              {
                "Ingrese un nombre que no contenga espacios, pues este será parte de la URL (e.g. my-club-2010)."
              }
            </p>
          </div>
          <div className="field">
            <label className="label label-form-election">
              Nombre de la elección
              <AsteriskRequiredField />
            </label>
            <div className="control">
              <input
                id="input-name"
                disabled={disabledEdit}
                className="input"
                type="text"
                placeholder="Nombre de la elección"
                value={electionParams.name}
                onChange={(e) => {
                  setElectionParams({
                    ...electionParams,
                    name: e.target.value,
                  });
                }}
              />
            </div>
            <p className="help">
              {
                "Ingrese un nombre bonito para su elección (e.g Elecciones de Mi Club 2010)."
              }
            </p>
          </div>
          <div className="field">
            <label className="label label-form-election">Descripción</label>
            <div className="control">
              <textarea
                disabled={disabledEdit}
                className="textarea"
                placeholder="Descripción"
                value={electionParams.description}
                onChange={(e) => {
                  setElectionParams({
                    ...electionParams,
                    description: e.target.value,
                  });
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
                  value={electionParams.election_type}
                  onChange={(e) => {
                    setElectionParams({
                      ...electionParams,
                      election_type: e.target.value,
                    });
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
              Peso máximo de los votantes
            </label>
            <div className="control">
              <input
                id="weight-input"
                disabled={disabledEdit}
                className="input"
                type="number"
                placeholder="Peso maximo"
                value={electionParams.max_weight}
                onChange={(e) => {
                  setElectionParams({
                    ...electionParams,
                    max_weight: e.target.value,
                  });
                }}
              />
            </div>
            <p className="help">
              {" "}
              El máximo valor que puede tener el peso de uno de los votantes.
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  disabled={disabledEdit}
                  onChange={(e) => {
                    setElectionParams({
                      ...electionParams,
                      obscure_voter_names: e.target.checked,
                    });
                  }}
                  checked={electionParams.obscure_voter_names}
                  type="checkbox"
                  className="mr-2"
                />
                Esconder nombres de los votantes
              </label>
            </div>
            <p className="help">
              {
                "Actívelo si desea que la identidad de los votantes sea remplazada por alias en el centro de rastreo de papeletas (e.g. V12)."
              }
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  disabled={disabledEdit}
                  onChange={(e) => {
                    setElectionParams({
                      ...electionParams,
                      randomize_answer_order: e.target.checked,
                    });
                  }}
                  checked={electionParams.randomize_answer_order}
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
                  id="private-input"
                  disabled={disabledEdit}
                  onChange={(e) => {
                    setElectionParams({
                      ...electionParams,
                      private_p: e.target.checked,
                    });
                  }}
                  checked={electionParams.private_p}
                  type="checkbox"
                  className="mr-2"
                />
                Elección privada
              </label>
            </div>
            <p className="help">
              Actívelo si desea que su elección sea privada, es decir, que solo
              sea visible para los votantes registrados.
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  onChange={(e) => {
                    setElectionParams({
                      ...electionParams,
                      normalization: e.target.checked,
                    });
                  }}
                  checked={electionParams.normalization}
                  type="checkbox"
                  className="mr-2"
                />
                Normalizar los resultados
              </label>
            </div>
            <p className="help">
              Actívelo si desea que los números de resultados que se muestran se
              dividan por el peso máximo de votantes.
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  onChange={(e) => {
                    setElectionParams({
                      ...electionParams,
                      grouped: e.target.checked,
                    });
                  }}
                  checked={electionParams.grouped}
                  type="checkbox"
                  className="mr-2"
                />
                Agrupar los resultados
              </label>
            </div>
            <p className="help">
              Actívelo si desea que los votantes esten agrupados.
            </p>
          </div>
          <div className="row">
            <div className="col-6 d-inline-flex justify-content-start">
              <Link
                className="link-button"
                style={{ color: "white" }}
                to={
                  props.edit
                    ? "/psifos/admin/" + shortName + "/panel"
                    : "/psifos/admin/home"
                }
              >
                <Button className="btn-fixed button-custom">Volver</Button>
              </Link>
            </div>
            <div className="col-6 d-inline-flex justify-content-end">
              {props.edit ? (
                <Button
                  onClick={() => {
                    sendElection("/edit-election/" + shortName);
                  }}
                  className="btn-fixed button-custom"
                >
                  Editar Elección
                </Button>
              ) : (
                <Button
                  id="button-send-election"
                  onClick={() => {
                    sendElection("/create-election");
                  }}
                  className="btn-fixed button-custom"
                >
                  Crear elección
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
      <FooterParticipa message="Participa UChile - 2023 - Universidad de Chile" />
    </div>
  );
}
export default CreateElection;
