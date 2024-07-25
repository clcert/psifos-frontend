import { useEffect, useState } from "react";
import ColumnPsifosTable from "./ColumnPsifosTable";

function StyledCell({content}) {
  return (
    <td
      style={{
        width: "180px", wordBreak: "break-word",
      }}
      className={
        typeof content === 'number' || !isNaN(parseInt(content))
        ? "has-text-right"
        : "has-text-centered"
      }
    >
      {content}
    </td>
  )
}

function PsifosTable({ data, election }) {
  const [tableData, setTableData] = useState(data);
  const [ordenamiento, setOrdenamiento] = useState({
    column: null,
    ascendente: true,
  });

  const arbitraryEl = data[0];
  const dataKeys = Object.keys(arbitraryEl);
  const intDataKeys = dataKeys.filter(
    (item) => typeof arbitraryEl[item] === "number"
  );

  useEffect(() => setTableData(data)
  , [data])

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
            <tr key={index}>
              {dataKeys.map((row, indexRow) => (
                <StyledCell
                  key={`row${indexRow}`}
                  content={election.normalization && indexRow === 1
                    ? parseFloat((fila[row] / election.max_weight)).toString().replace(".", ",")
                    : (indexRow === 2 ? fila[row].replace(".", ",") : fila[row])}
                />
              ))}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default PsifosTable;
