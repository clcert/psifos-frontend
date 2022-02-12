function InfoElection(props) {
  if (props.totalVoters !== 0) {
    return (
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
                <td className="has-text-centered">{props.numVoters}</td>
              </tr>
              <tr>
                <td>Total Padrón</td>
                <td className="has-text-centered">{props.totalVoters}</td>
              </tr>
              <tr>
                <td>Participación</td>
                <td className="has-text-centered">
                  {((props.numVoters / props.totalVoters) * 100).toFixed(2)}%
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
              {Object.keys(props.infoElection).map((key) => (
                <tr key={key}>
                  <td className="has-text-centered">{key / props.maxWeight}</td>
                  <td className="has-text-centered"></td>
                  <td className="has-text-centered"></td>
                  <td className="has-text-centered"></td>
                  <td className="has-text-centered">
                    {props.infoElection[key]}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    );
  } else {
    return (
      <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
        <div>
          <h1 className="title is-size-4">Aun no existen votantes para esta elección</h1>
        </div>
      </section>
    );
  }
}

export default InfoElection;
