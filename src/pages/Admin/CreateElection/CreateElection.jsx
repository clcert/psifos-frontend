import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { useState, useEffect, useCallback } from "react";
import { backendOpIP } from "../../../server";
import SubNavbar from "../component/SubNavbar";
import AlertNotification from "../component/AlertNotification";
import { getElection } from "../../../services/election";
import { useDispatch, useSelector } from "react-redux";
import { setElection } from "../../../store/slices/electionSlice";

function AsteriskRequiredField() {
  return <span className="asterisk-required-field">*</span>;
}

function CreateElection(props) {
  /**
   * view that handles the creation of a election
   */

  const dispatch = useDispatch();
  const election = useSelector((state) => state.election.actualElection);

  /** @state {string} short name for election */
  const [electionParams, setElectionParams] = useState({
    short_name: "",
    name: "",
    description: "",
    election_type: "election",
    max_weight: 1,
    obscure_voter_names: false,
    randomize_answer_order: false,
    election_login_type: "close_p",
    normalization: false,
    grouped: false,
  });

  /** @state {string} alert message  */
  const [alertMessage, setAlertMessage] = useState("");

  const [disabledEdit, setDisabledEdit] = useState("");

  /** @urlParam {string} shortName of election  */
  const { shortName } = useParams();

  const initComponent = useCallback((election) => {
    setDisabledEdit(election.election_status !== "Setting up");
    const electionType = {
      Open: "open_p",
      Close: "close_p",
      "Semi Public": "semi_close_p",
    };
    const params = {
      short_name: election.short_name,
      name: election.name,
      description: election.description,
      election_type: election.election_type.toLocaleLowerCase(),
      max_weight: election.max_weight,
      obscure_voter_names: election.obscure_voter_names,
      randomize_answer_order: election.randomize_answer_order,
      election_login_type: electionType[election.election_login_type],
      normalization: election.normalization,
      grouped: election.grouped,
    };
    setElectionParams(params);
  }, []);

  useEffect(() => {
    if (props.edit && Object.keys(election).length === 0) {
      getElection(shortName).then((election) => {
        const { resp, jsonResponse } = election;
        if (resp.status === 200) {
          dispatch(setElection(jsonResponse));
          initComponent(jsonResponse);
        } else {
          setAlertMessage(jsonResponse.message);
        }
      });
    } else if (props.edit && Object.keys(election).length !== 0) {
      initComponent(election);
    }
  }, [props.edit, shortName, initComponent, dispatch, election]);

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
          <label className="label label-form-election">
            Ingreso del votante
          </label>
          <div className="control">
            <div className="select">
              <select
                disabled={disabledEdit}
                value={electionParams.election_login_type}
                onChange={(e) => {
                  setElectionParams({
                    ...electionParams,
                    election_login_type: e.target.value,
                  });
                }}
              >
                <option value="close_p">Cerrado</option>
                <option value="open_p">Abierto</option>
                <option value="semi_close_p">Semi cerrado</option>
              </select>
            </div>
          </div>
          <div className="field"></div>

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
                Aleatorizar el orden de las opciones
              </label>
            </div>
            <p className="help">
              Actívelo si desea que las opciones de las preguntas aparezcan en
              orden aleatorio para cada votante
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
      <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
    </div>
  );
}
export default CreateElection;
