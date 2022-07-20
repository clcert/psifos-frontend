import { useState } from "react";
import { useEffect } from "react";

function InfoElection(props) {
  const [totalVoters, setTotalVoters] = useState(0);

  const [totalVotes, setTotalVotes] = useState(0);

  useEffect(() => {
    if (props.weightsEnd && props.weightsInit) {
      let aux_totalVoters = 0;
      let aux_totalVotes = 0;

      Object.keys(props.weightsInit).forEach((key) => {
        aux_totalVoters += props.weightsInit[key];
        aux_totalVotes += props.weightsEnd[key];
      });

      setTotalVoters(aux_totalVoters);
      setTotalVotes(aux_totalVotes);
    }
  }, []);

  if (props.totalVoters !== 0) {
    return (
      <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
        {props.weightsEnd && props.weightsInit ? (
          <>
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
                    <td className="has-text-centered">{totalVotes}</td>
                  </tr>
                  <tr>
                    <td>Total Padrón</td>
                    <td className="has-text-centered">{totalVoters}</td>
                  </tr>
                  <tr>
                    <td>Participación</td>
                    <td className="has-text-centered">
                      {((totalVotes / totalVoters) * 100).toFixed(2)}%
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
                  {Object.keys(props.weightsInit).map((key) => (
                    <tr key={key}>
                      <td className="has-text-centered">{key[0]}</td>
                      <td className="has-text-centered"></td>
                      <td className="has-text-centered">
                        {props.weightsInit[key]}
                      </td>
                      <td className="has-text-centered">
                        {props.weightsEnd[key]}
                      </td>
                      <td className="has-text-centered">{key[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <div className="box" id="not-results-box">
            <p className="is-size-3 has-text-weight-bold">
              Elección aun no finaliza.
            </p>
          </div>
        )}
      </section>
    );
  } else {
    return (
      <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
        <div>
          <h1 className="title is-size-4">
            Aun no existen votantes para esta elección
          </h1>
        </div>
      </section>
    );
  }
}

export default InfoElection;
