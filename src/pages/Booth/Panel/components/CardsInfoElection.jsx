import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../../server";
import { getStats } from "../../../../services/election";
import { singularOrPlural } from "../../../../utils/utils";

function StyledRow({children}) {
  return (
    <div className={"row justify-content-between"}>
      {children}
    </div>
  )
}

function StyledCard({children}) {
  return(
    <div
      className="box col-sm-3 col-12 m-0 mb-3"
      style={{minWidth: '30%'}}
    >
      {children}
    </div>
  )
}

function PercentageCard({
  title, cipher,
}) {
  return (
    <StyledCard>
      <div className="text-center is-size-8">{title}</div>
      <span className="d-flex justify-content-center is-size-4 is-bold">
        {cipher}%
      </span>
    </StyledCard>
  )
}

function QuantitativeCard({
  title, cipher, singular, plural,
}) {
  return (
    <StyledCard>
      <div className="text-center is-size-8">{title}</div>
      <span className="d-flex justify-content-center is-size-4 is-bold">
        {cipher}
        {" "}
        {singularOrPlural(singular, plural, cipher)}
      </span>
    </StyledCard>
  )
}

export default function StyledCardsInfoElection() {
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
      //setWeightsInit(sortedWeights);
      //setWEightsElection(JSON.parse(jsonResponse.weights_election));
      setWeightsInit(['1.0', '2.0', '3.0', '4.0', '5.0', '6.0', '7.0']);
      setWEightsElection({'1.0': 1, '2.0': 2, '3.0': 3, '4.0': 3, '5.0': 3, '6.0': 3, '7.0': 3});

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
      <StyledRow>
        <QuantitativeCard
          title="Total votos"
          cipher={totalVotes}
          singular="voto"
          key="nroVotos"
        />
        <PercentageCard
          title="Participación"
          cipher={isNaN(percentageVotes) ? 0 : percentageVotes}
          key="participacion"
        />
        <QuantitativeCard
          title="Total padrón"
          cipher={totalVoters}
          singular="votante"
          plural="votantes"
          key="nroVotantes"
        />
      </StyledRow>
      <StyledRow>
        {weightsInit &&
          weightsInit.map((weight) => {
            return (
              <QuantitativeCard
                title={`Votos ponderación ${weight}`}
                cipher={weightsElection[weight] ? weightsElection[weight] : 0}
                singular="voto"
                key={`votosPonderacion${weight}`}
              />
            );
          })}
      </StyledRow>
    </div>
  );
}
