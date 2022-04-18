import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import TimeField from "react-simple-timefield";
import { useState, useEffect } from "react";
import { backendIP } from "../../../server";

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

  /** @state {boolean} indicates if there is a help mail */
  const [helpEmail, setHelpEmail] = useState(null);

  /** @state {number} max weight for election */
  const [maxWeight, setMaxWeight] = useState(1);

  /** @state {string} date for start election */
  const [votingStartDate, setVotingStartDate] = useState(null);

  /** @state {string} time for start election */
  const [votingStartTime, setVotingStartTime] = useState("00:00");

  /** @state {string} date for end election */
  const [votingEndDate, setVotingEndDate] = useState(null);

  /** @state {string} time for end election */
  const [votingEndTime, setVotingEndTime] = useState("00:00");

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

  /** @urlParam {string} uuid of election  */
  const { uuid } = useParams();

  useEffect(() => {
    if (props.edit) {
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
        const data = await resp.json();
        if (resp.status === 200) {
          setShortName(data.short_name);
          setName(data.name);
          setDescription(data.description);
          setElectionType(data.election_type);
          setHelpEmail(data.help_email);
          setMaxWeight(data.max_weight);
          setVotingStartDate(data.voting_started_at.split("T")[0]);
          setVotingStartTime(
            data.voting_started_at.split("T")[1].substring(0, 5)
          );
          setVotingEndDate(data.voting_ends_at.split("T")[0]);
          setVotingEndTime(data.voting_ends_at.split("T")[1].substring(0, 5));
          setVoterAliases(data.use_voter_aliases);
          setRandomizeAnswer(data.randomize_answer_order);
          setPrivateElection(data.private_p);
          setNormalization(data.normalization);
        } else {
          setAlertMessage(data.message);
        }
      }
      getElection();
    }
  }, []);

  async function sendElection(url) {
    /**
     * async function to send and create a election
     */
    if (checkData()) {
      const token = sessionStorage.getItem("token");
      const resp = await fetch(backendIP + url, {
        method: "POST",
        headers: {
          "x-access-tokens": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          short_name: shortName,
          name: name,
          description: description,
          election_type: electionType,
          help_email: helpEmail,
          max_weight: maxWeight,
          voting_started_at: votingStartDate
            ? votingStartDate + " " + votingStartTime + ":00"
            : null,
          voting_ends_at: votingEndDate
            ? votingEndDate + " " + votingEndTime + ":00"
            : null,
          use_voter_aliases: voterAliases,
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
      if (resp.status === 200) {
        window.location.href = "/admin/home";
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
     * function to check if the data is correct
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
          <Title namePage="Creación de Elección" />
        </div>
      </section>

      <section
        className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
        id="create-election-section"
      >
        <div className="form-election">
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
                  value={electionType}
                  onChange={(e) => {
                    setElectionType(e.target.value);
                  }}
                >
                  <option value="election">Elección</option>
                  <option value="referendum">Referendum</option>
                </select>
              </div>
            </div>
          </div>

          <div className="field">
            <label className="label label-form-election">Correo de ayuda</label>
            <div className="control">
              <input
                onChange={(e) => {
                  setHelpEmail(e.target.value);
                }}
                value={helpEmail}
                className="input"
                type="text"
                placeholder="Correo"
              />
            </div>
            <p className="help">
              An email address voters should contact if they need help.
            </p>
          </div>
          <div className="field">
            <label className="label label-form-election">
              Peso maximo de los votantes
            </label>
            <div className="control">
              <input
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
            <label className="label label-form-election">Fecha de inicio</label>
            <div className="control mb-2">
              <input
                className="input input-calendar"
                type="date"
                placeholder="Fecha de inicio"
                value={votingStartDate}
                onChange={(e) => {
                  setVotingStartDate(e.target.value);
                }}
              />
            </div>
            <TimeField
              onChange={(e) => {
                setVotingStartTime(e.target.value);
              }}
              value={votingStartTime}
              style={{ width: "46px" }}
              colon=":"
            />
          </div>
          <div className="field">
            <label className="label label-form-election">
              Fecha de termino
            </label>
            <div className="control mb-2">
              <input
                className="input input-calendar"
                type="date"
                placeholder="Fecha de inicio"
                value={votingEndDate}
                onChange={(e) => {
                  setVotingEndDate(e.target.value);
                }}
              />
            </div>
            <TimeField
              onChange={(e) => {
                setVotingEndTime(e.target.value);
              }}
              value={votingEndTime}
              style={{ width: "46px" }}
              colon=":"
            />
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
                  onChange={(e) => {
                    setVoterAliases(e.target.checked);
                  }}
                  checked={voterAliases}
                  type="checkbox"
                  className="mr-2"
                />
                User voter aliases
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
                  onChange={(e) => {
                    setRandomizeAnswer(e.target.checked);
                  }}
                  checked={randomizeAnswer}
                  type="checkbox"
                  className="mr-2"
                />
                Randomize answer order
              </label>
            </div>
            <p className="help">
              enable this if you want the answers to questions to appear in
              random order for each voter
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
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
              A private election is only visible to registered voters.
            </p>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox">
                <input
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
              Results numbers displayed are divided by Maximum Voter Weight
            </p>
          </div>
          <div className="level">
            <Button className="button-custom mr-2 ml-2 level-left">
              <Link className="link-button" to={"/admin/" + uuid + "/panel"}>
                Atras
              </Link>
            </Button>
            {props.edit ? (
              <Button
                onClick={() => {
                  sendElection("/edit_election/" + uuid);
                }}
                className="button-custom mr-2 ml-2 level-right"
              >
                Editar Elección
              </Button>
            ) : (
              <Button
                onClick={() => {
                  sendElection("/create_election");
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
