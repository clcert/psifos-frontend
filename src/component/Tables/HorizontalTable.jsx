export default function SimpleHorizontalTable({contentPerRow}) {
    return (
      <table
        id="resume-table"
        className="mt-2 table is-hoverable voters-table"
        style={{ maxWidth: "350px", margin: "0px !important" }}
      >
        {contentPerRow.map((row) => {
          return (
            <tr>
              <td className="table-header">{row.header}</td>
              <td className="has-text-centered">{row.value}</td>
            </tr>
          )
        })}
      </table>
    )
  }