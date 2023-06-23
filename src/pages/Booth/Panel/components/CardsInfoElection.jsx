import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../../server";
import { getStats } from "../../../../services/election";

export default function CardsInfoElection() {
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [weightsInit, setWeightsInit] = useState([]);
  const [weightsElection, setWEightsElection] = useState({});

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  async function getElectionResume() {
    /**
     * async function to get the election data
     */

    const resp = await fetch(backendInfoIp + "/" + shortName + "/resume", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.status === 200) {
      const jsonResponse = await resp.json();
      const sortedWeights = sortWeight(JSON.parse(jsonResponse.weights_init));
      setWeightsInit(sortedWeights);
      setWEightsElection(JSON.parse(jsonResponse.weights_election));

      return jsonResponse;
    }
  }

  const sortWeight = (weights) => {
    return Object.keys(weights).sort();
  };

  useEffect(() => {
    getElectionResume();
    getStats(shortName).then((data) => {
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
          weightsInit.map((weight, index) => {
            return (
              <>
                <div
                  className={`box col-sm-3 col-12 ${
                    index % 3 === 0 ? "ml-0 mr-1" : ""
                  } ${index % 3 === 2 ? "mr-0 ml-1" : ""}`}
                  key={index}
                >
                  <div className="text-center is-size-5">
                    Votos ponderación {weight}
                  </div>
                  <span className="d-flex justify-content-center">
                    {weightsElection[weight] ? weightsElection[weight] : 0}{" "}
                    votos
                  </span>
                </div>
              </>
            );
          })}
      </div>
    </div>
  );
}
