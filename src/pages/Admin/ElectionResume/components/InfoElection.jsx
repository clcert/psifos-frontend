import ResumeTable from "./ResumeTable";

function InfoElection(props) {
  /**
   * Component containing the election information
   */

  if (props.totalVoters !== 0) {
    return (
      <section className="section voters-section is-flex is-flex-direction-column is-align-items-center">
        {props.load ? (
          <>
            {" "}
            {props.weightsEnd && props.weightsInit ? (
              <>
                <div>
                  <h1 className="title is-size-4">Apertura de Urna</h1>
                </div>
                <ResumeTable />
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
          </>
        ) : (
          <div className="spinner-animation"></div>
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
