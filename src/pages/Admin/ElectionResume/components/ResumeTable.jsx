import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStats } from "../../../../services/election";
import { getPercentage } from "../../utils"

export default function ResumeTable() {
  /** @state {int} number of voters in the election  */
  const [totalVoters, setTotalVoters] = useState(0);

  /** @state {int} number of votes in the election  */
  const [totalVotes, setTotalVotes] = useState(0);

  /** @state {int} number of votes in the election  */
  const [countVotes, setCountVotes] = useState(0);

  /** @urlParam {string} uuid of election */
  const { shortName } = useParams();

  useEffect(() => {
    getStats(shortName).then((data) => {
      const { jsonResponse } = data;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
      setCountVotes(jsonResponse.num_count_votes)
    });
  }, [shortName]);


  return (
    <div className="d-flex disable-text-selection row justify-content-md-center">
      <table
        id="resume-table"
        className="mt-2 table is-bordered is-hoverable voters-table"
        style={{maxWidth: "350px"}}
      >
        <tbody>
          <tr>
            <td className="table-header">Votos Recibidos</td>
            <td className="has-text-centered">{totalVotes}</td>
          </tr>
          <tr>
            <td className="table-header">Votos Contabilizados</td>
            <td className="has-text-centered">{countVotes}</td>
          </tr>
          <tr>
            <td className="table-header">Total Padrón</td>
            <td className="has-text-centered">{totalVoters}</td>
          </tr>
          <tr>
            <td className="table-header">Participación</td>
            <td className="has-text-centered">
              {getPercentage(totalVotes, totalVoters)}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}
