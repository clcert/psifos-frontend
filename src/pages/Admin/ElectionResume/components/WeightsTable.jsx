import { Table, Thead, Tbody, Tr, Th, Td } from "react-super-responsive-table";

export default function WeightsTable({
  weightsInit,
  weightsEnd,
  weightsElection,
}) {
  if(!weightsInit) return <></>

  return (
    <div className="disable-text-selection row justify-content-md-center has-text-centered px-6">
      <Table
        id="weights-table"
        className="mt-2 table is-bordered is-hoverable voters-table"
      >
        <Thead>
          <Tr>
            <Th className="has-text-centered">PONDERADOR</Th>
            <Th className="has-text-centered">Votantes en padrón</Th>
            <Th className="has-text-centered">Votos recibidos</Th>
            <Th className="has-text-centered">Votos a contar (1)</Th>
          </Tr>
        </Thead>
        <Tbody>
          {Object.keys(weightsInit)
            .sort()
            .map((key) => (
              <Tr key={key}>
                <Td
                  className="has-text-centered is-vcentered is-size-5"
                  style={{ backgroundColor: "#009391", color: "white" }}
                >
                  {parseFloat(key).toString().replace(".", ",")}
                </Td>
                <Td className="has-text-centered is-vcentered">
                  {weightsInit[key] ? weightsInit[key] : 0}
                </Td>

                <Td className="has-text-centered is-vcentered">
                  {weightsEnd[key] ? weightsEnd[key] : 0}
                </Td>

                <Td className="has-text-centered is-vcentered">
                  {weightsElection[key] ? weightsElection[key] : 0}
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
