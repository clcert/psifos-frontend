import { useState } from "react";
import ColumnPsifosTable from "./ColumnPsifosTable";

function PsifosTable({ data }) {
  const [tableData, setTableData] = useState([...data]);
  const [ordenamiento, setOrdenamiento] = useState({
    column: null,
    ascendente: true,
  });

  const dataKeys = Object.keys(data[0]);
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
              filteredData={tableData}
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
              {dataKeys.map((row) => (
                <td style={boxResult} key={row}>
                  {fila[row]}
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
