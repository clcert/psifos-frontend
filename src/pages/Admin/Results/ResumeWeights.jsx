import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getElectionResume } from "../../../services/election";
import CardTitle from "./components/CardTitle";
import WeightsTable from "../ElectionResume/components/WeightsTable";

export default function ResumeWeights() {
  const [weightsInit, setWeightsInit] = useState({});

  const [weightsEnd, setWeightsEnd] = useState({});

  const [weightsElection, setWeightsElection] = useState({});

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();
  
  useEffect(
    function effectFunction() {
      getElectionResume(shortName).then((data) => {
        const { jsonResponse } = data;
        setWeightsInit(JSON.parse(jsonResponse.weights_init));
        setWeightsEnd(JSON.parse(jsonResponse.weights_end));
        setWeightsElection(JSON.parse(jsonResponse.weights_election));
      });
    },
    [shortName]
  );

  return (
    <>
      <CardTitle title="Número de votantes por ponderación" />
      <WeightsTable
        weightsInit={weightsInit}
        weightsEnd={weightsEnd}
        weightsElection={weightsElection}
      />
    </>
  );
}
