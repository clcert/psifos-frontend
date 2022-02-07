import { useState } from "react";
import ElectionCode from "../component/ElectionCode";
import MyNavbar from "../component/MyNavbar";
import imageTrustees from "../static/svg/trustees-list.svg";
import "../static/css/booth.css";
import { useParams } from "react-router";
import backendIP from "../server";
import Title from "../component/Title";
import ImageFooter from "../component/ImageFooter";

function ElectionResume() {
  const [nameElection, setNameElection] = useState("");
  const [numVoters, setNumVoters] = useState("");
  const [totalVoters, setTotalVoters] = useState("");
  const [maxWeight, setMaxWeight] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoElection, setInfoElection] = useState(null);

  const { uuid } = useParams();

  async function getElectionResume() {
    const resp = await fetch(backendIP + "/elections/" + uuid + "/resume", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const jsonResponse = await resp.json();
    return jsonResponse;
  }
  if (!loading) {
    getElectionResume().then((data) => {
      setNameElection(data.name);
      setNumVoters(data.num_voters);
      setTotalVoters(data.total_voters);
      setMaxWeight(data.max_weight);
      setInfoElection(data.info);
      setLoading(true);
    });
  }

  if (infoElection !== null) {
    return (
      <div id="content-voters">
        <section className="parallax hero is-medium">
          <div className="hero-body pt-0 px-0 header-hero">
            <MyNavbar />
            <Title namePage="Resumen de Elección" nameElection={nameElection} />
          </div>
        </section>
        <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
          <div>
            <h1 className="title is-size-4">Apertura de Urna</h1>
          </div>

          <div className="disable-text-selection row justify-content-md-center">
            <table
              id="resume-table"
              className="mt-2 table is-bordered is-hoverable voters-table"
            >
              <tbody>
                <tr>
                  <td>Votos Recibidos</td>
                  <td className="has-text-centered">{numVoters}</td>
                </tr>
                <tr>
                  <td>Total Padrón</td>
                  <td className="has-text-centered">{totalVoters}</td>
                </tr>
                <tr>
                  <td>Participación</td>
                  <td className="has-text-centered">
                    {((numVoters / totalVoters) * 100).toFixed(2)}%
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div>
            <h1 className="title is-size-4 pt-4">
              Número de votantes por ponderación
            </h1>
          </div>
          <div className="disable-text-selection row justify-content-md-center">
            <table
              id="weights-table"
              className="mt-2 table is-bordered is-hoverable voters-table"
            >
              <thead>
                <tr>
                  <th>Ponderador</th>
                  <th>Preliminar</th>
                  <th>Inicial</th>
                  <th>Votos Recibidos</th>
                  <th>Efectivo</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(infoElection).map((key) => (
                  <tr key={key}>
                    <td className="has-text-centered">{key / maxWeight}</td>
                    <td className="has-text-centered"></td>
                    <td className="has-text-centered"></td>
                    <td className="has-text-centered"></td>
                    <td className="has-text-centered">{infoElection[key]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <ImageFooter imagePath={imageTrustees} />
        <ElectionCode uuid={uuid} />
      </div>
    );
  } else {
    return (
      <div>
        <h1>Loading</h1>
      </div>
    );
  }
}

export default ElectionResume;
