import { Button } from "react-bulma-components";
import { Link } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import TimeField from "react-simple-timefield";
import { useState } from "react";
import { backendIP } from "../../../server";

function CreateElection() {
  const [shortName, setShortName] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [electionType, setElectionType] = useState("election");
  const [helpEmail, setHelpEmail] = useState(null);
  const [maxWeight, setMaxWeight] = useState(1);
  const [votingStartDate, setVotingStartDate] = useState(null);
  const [votingStartTime, setVotingStartTime] = useState("00:00");
  const [votingEndDate, setVotingEndDate] = useState(null);
  const [votingEndTime, setVotingEndTime] = useState("00:00");

  const [voterAliases, setVoterAliases] = useState(false);
  const [randomizeAnswer, setRandomizeAnswer] = useState(false);
  const [privateElection, setPrivateElection] = useState(false);
  const [normalization, setNormalization] = useState(false);

  const [alertMessage, setAlertMessage] = useState("");

  async function createElection() {
    const token = sessionStorage.getItem("token");
    const resp = await fetch(backendIP + "/create_election", {
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
        voting_started_at: votingStartDate ? (votingStartDate + " " + votingStartTime + ":00") : null,
        voting_ends_at: votingEndDate ?  (votingEndDate + " " + votingEndTime + ":00") : null,
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
          <div>{alertMessage}</div>
          <div className="field">
            <label className="label label-form-election">Nombre corto</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Nombre corto"
                onChange={(e) => {
                  setShortName(e.target.value);
                }}
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
                onChange={(e) => {
                  setVotingStartDate(e.target.value);
                }}
              />
            </div>
            <TimeField
              onChange={(e) => {
                setVotingStartTime(e.target.value);
              }}
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
                onChange={(e) => {
                  setVotingEndDate(e.target.value);
                }}
              />
            </div>
            <TimeField
              onChange={(e) => {
                setVotingEndTime(e.target.value);
              }}
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
              <Link className="link-button" to="/admin/home">
                Atras
              </Link>
            </Button>
            <Button
              onClick={createElection}
              className="button-custom mr-2 ml-2 level-right"
            >
              Crear elección
            </Button>
          </div>
        </div>
      </section>
      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}
export default CreateElection;
