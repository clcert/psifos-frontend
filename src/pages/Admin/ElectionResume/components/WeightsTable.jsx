export default function WeightsTable(props) {

    return (
        <div className="disable-text-selection row justify-content-md-center has-text-centered">
            <table
            id="weights-table"
            className="mt-2 table is-bordered is-hoverable voters-table"
            >
                <thead>
                    <tr>
                    <th>PONDERADOR</th>
                    <th>Votantes en apertura</th>
                    <th>Votos Recibidos</th>
                    <th>Votos a contar (1)</th>
                    </tr>
                </thead>
                <tbody>
                    {Object.keys(props.weightsInit).sort().map((key) => (
                        <tr key={key}>
                            <td className="has-text-centered" style={{backgroundColor: "#009391", color: "white"}}>
                                {key}
                            </td>
                            <td className="has-text-centered">
                                {props.weightsInit[key] ? props.weightsInit[key] : 0}
                            </td>
                            <td className="has-text-centered">
                                {props.weightsEnd[key] ? props.weightsEnd[key] : 0}
                            </td>
                            <td className="has-text-centered">
                                {props.weightsElection[key] ? props.weightsElection[key] : 0}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        <p>(1): Cálculo realizado según lo establecido por el inciso 4° del Art. 12 del Reglamento General de Elecciones y Consultas</p>
        </div>
    )

}