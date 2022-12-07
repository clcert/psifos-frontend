function ResultTable(props) {
  return (
    <table className="pretty table is-hoverable voters-table">
      <thead>
        <tr>
          <th className="has-text-centered">Respuesta</th>
          <th className="has-text-centered pl-4 pr-4">Resultado</th>
        </tr>
      </thead>
      <tbody>
        {props.result.ans_results.map((result, index) => {
          return (
            <tr className="has-text-centered" key={index}>
              <td>
                <b className="p-4">{props.question.closed_options[index]}</b>
              </td>
              <td>
                <b className="p-4">{result}</b>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default ResultTable;
