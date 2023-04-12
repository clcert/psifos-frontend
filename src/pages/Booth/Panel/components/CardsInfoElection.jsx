import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getStats } from "../../../../services/election";

export default function CardsInfoElection() {
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    getStats(uuid).then((data) => {
      const { jsonResponse } = data;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
    });
  });

  return (
    <div className={"row justify-content-between"}>
      <div className="box col-sm-3 col-12 m-0">
        <div className="text-center is-size-4">Total Votos</div>
        <span className="d-flex justify-content-center">
          {totalVotes} votos
        </span>
      </div>
      <div className="box col-sm-4 col-12 m-0 mx-sm-2 mx-0">
        <div className="text-center is-size-4">Participación</div>
        <span className="d-flex justify-content-center">
          {((totalVotes / totalVoters) * 100).toFixed(2)}%
        </span>
      </div>
      <div className="box col-sm-3 col-12">
        <div className="text-center is-size-4">Total padron</div>
        <span className="d-flex justify-content-center">
          {totalVoters} votantes
        </span>
      </div>
    </div>
  );
}
