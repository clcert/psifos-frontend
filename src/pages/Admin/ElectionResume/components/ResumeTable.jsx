import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStats } from "../../../../services/election";

export default function ResumeTable() {
  /** @state {int} number of voters in the election  */
  const [totalVoters, setTotalVoters] = useState(0);

  /** @state {int} number of votes in the election  */
  const [totalVotes, setTotalVotes] = useState(0);

  /** @urlParam {string} uuid of election */
  const { shortName } = useParams();

  useEffect(() => {
    getStats(shortName).then((data) => {
      const { jsonResponse } = data;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
    });
  }, [shortName]);

  const tableStyle = {
    width: "220px",
  };

  return (
    <div className="d-flex disable-text-selection row justify-content-md-center">
      <table
        style={tableStyle}
        id="resume-table"
        className="mt-2 table is-bordered is-hoverable voters-table"
      >
        <tbody>
          <tr>
            <td>Votos Recibidos</td>
            <td className="has-text-centered">{totalVotes}</td>
          </tr>
          <tr>
            <td>Total Padrón</td>
            <td className="has-text-centered">{totalVoters}</td>
          </tr>
          <tr>
            <td>Participación</td>
            <td className="has-text-centered">
              {((totalVotes / totalVoters) * 100).toFixed(2)}%
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
