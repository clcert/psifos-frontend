import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

export default function WeightsTable(props) {
  return (
    <div className="disable-text-selection row justify-content-md-center has-text-centered px-6">
      <Table
        id="weights-table"
        className="mt-2 table is-bordered is-hoverable voters-table"
      >
        <Thead>
          <Tr>
            <Th>Ponderador</Th>
            <Th className="has-text-centered">Votantes en apertura</Th>
            <Th className="has-text-centered">Votos Recibidos</Th>
            <Th className="has-text-centered">Votos a contar (1)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(props.weightsInit)
            .sort()
            .map((key) => (
              <Tr key={key}>
                <Td
                  className="has-text-centered"
                  style={{ backgroundColor: "#009391", color: "white" }}
                >
                  {key}
                </Td>
                <Td className="has-text-centered">
                  {props.weightsInit[key] ? props.weightsInit[key] : 0}
                </Td>
                <Td className="has-text-centered">
                  {props.weightsEnd[key] ? props.weightsEnd[key] : 0}
                </Td>
                <Td className="has-text-centered">
                  {props.weightsElection[key] ? props.weightsElection[key] : 0}
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
      <p>
        (1): Cálculo realizado según lo establecido por el inciso 4° del Art. 12
        del Reglamento General de Elecciones y Consultas
      </p>
    </div>
  );
}
