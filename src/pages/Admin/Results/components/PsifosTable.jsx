import { useState } from "react";
import ColumnPsifosTable from "./ColumnPsifosTable";
import { getElection } from "../../../../services/election";
import { useParams } from "react-router-dom";

function PsifosTable({ data }) {
  const [tableData, setTableData] = useState([...data]);
  const [election, setElection] = useState({});
  const [ordenamiento, setOrdenamiento] = useState({
    column: null,
    ascendente: true,
  });
  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  getElection(shortName).then((election) => {
    const { resp, jsonResponse } = election;
    if (resp.status === 200) {
      setElection(jsonResponse);
    }
  });

  const arbitraryEl = data[0];
  const dataKeys = Object.keys(arbitraryEl);
  const intDataKeys = dataKeys.filter(
    (item) => typeof arbitraryEl[item] === "number"
  );

  const boxResult = {
    width: "180px",
  };

  return (
    <table className="pretty table is-hoverable voters-table">
      <thead>
        <tr>
          {dataKeys.map((row, index) => (
            <ColumnPsifosTable
              key={index}
              index={index}
              nameRow={row}
              data={data}
              hideZeros={intDataKeys.includes(row)}
              setFilteredData={(table) => setTableData(table)}
              ordenamiento={ordenamiento}
              setOrdenamiento={(newOrdenamiento) =>
                setOrdenamiento(newOrdenamiento)
              }
            />
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((fila, index) => {
          return (
            <tr className="has-text-centered" key={index}>
              {dataKeys.map((row, indexRow) => (
                <td style={boxResult} key={row}>
                  {election.normalization && indexRow === 1
                    ? parseFloat((fila[row] / election.max_weight).toFixed(3))
                    : fila[row]}
                </td>
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PsifosTable;
