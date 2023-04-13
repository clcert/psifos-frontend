import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../../server";
import { getStats } from "../../../../services/election";

export default function CardsInfoElection() {
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [weightsInit, setWeightsInit] = useState({});
  const [weightsElection, setWEightsElection] = useState({});

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  async function getElectionResume() {
    /**
     * async function to get the election data
     */

    const resp = await fetch(backendInfoIp + "/" + uuid + "/resume", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.status === 200) {
      const jsonResponse = await resp.json();

      setWeightsInit(JSON.parse(jsonResponse.weights_init));
      setWEightsElection(JSON.parse(jsonResponse.weights_election));

      return jsonResponse;
    }
  }

  useEffect(() => {
    getElectionResume();
    getStats(uuid).then((data) => {
      const { jsonResponse } = data;
      setTotalVoters(jsonResponse.total_voters);
      setTotalVotes(jsonResponse.num_casted_votes);
    });
  }, []);

  const percentageVotes = ((totalVotes / totalVoters) * 100).toFixed(2);

  return (
    <div>
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
            {isNaN(percentageVotes) ? 0 : percentageVotes}%
          </span>
        </div>
        <div className="box col-sm-3 col-12">
          <div className="text-center is-size-4">Total padron</div>
          <span className="d-flex justify-content-center">
            {totalVoters} votantes
          </span>
        </div>
      </div>
      <div className={"row justify-content-between mt-4"}>
        {weightsInit &&
          Object.keys(weightsInit).map((weight, index) => {
            return (
              <div className="box col-sm-3 col-12 m-0" key={index}>
                <div className="text-center is-size-5">
                  Votos ponderación {weight}
                </div>
                <span className="d-flex justify-content-center">
                  {weightsElection[weight] ? weightsElection[weight] : 0} votos
                </span>
              </div>
            );
          })}
      </div>
    </div>
  );
}
