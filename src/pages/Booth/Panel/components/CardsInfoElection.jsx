import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendInfoIp } from "../../../../server";
import { getElectionPublic, getStats } from "../../../../services/election";
import { singularOrPlural } from "../../../../utils/utils";

function StyledRow({ children }) {
  return <div className={"row justify-content-between"}>{children}</div>;
}

function StyledCard({ children }) {
  return (
    <div className="box col-sm-3 col-12 m-0 mb-3" style={{ minWidth: "30%" }}>
      {children}
    </div>
  );
}

function PercentageCard({ title, cipher }) {
  return (
    <StyledCard>
      <div className="text-center is-size-8">{title}</div>
      <span className="d-flex justify-content-center is-size-4 is-bold">
        {cipher}%
      </span>
    </StyledCard>
  );
}

function QuantitativeCard({ title, cipher, singular, plural }) {
  return (
    <StyledCard>
      <div className="text-center is-size-8">{title}</div>
      <span className="d-flex justify-content-center is-size-4 is-bold">
        {cipher} {singularOrPlural(singular, plural, cipher)}
      </span>
    </StyledCard>
  );
}

/**
 * Renders a component that displays information about an election, such as the total number of votes, the participation percentage, and the total number of voters.
 * @returns {JSX.Element} The JSX code that displays the election information.
 */
export default function StyledCardsInfoElection() {
  const [totalVoters, setTotalVoters] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [weightsInit, setWeightsInit] = useState([]);
  const [weightsElection, setWEightsElection] = useState({});
  const [election, setElection] = useState({});

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  /**
   * Retrieves the resume of the election from the backend and updates the state with the weights of the voters.
   * @returns {Promise<Object>} A promise that resolves to the JSON response from the backend.
   */
  async function getElectionResume() {
    const resp = await fetch(`${backendInfoIp}/${shortName}/resume`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (resp.status === 200) {
      const jsonResponse = await resp.json();
      const sortedWeights = Object.keys(
        JSON.parse(jsonResponse.weights_init).voters_by_weight_init
      ).sort();
      setWeightsInit(sortedWeights);
      setWEightsElection(
        JSON.parse(jsonResponse.weights_election).voters_by_weight
      );
      return jsonResponse;
    }
  }

  useEffect(() => {
    getElectionResume();
    getElectionPublic(shortName).then((data) => {
      const { jsonResponse } = data;
      setElection(jsonResponse);
    });
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
        {election.max_weight > 1 &&
          weightsInit &&
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
