import CardTitle from "./components/CardTitle";
import WeightsTable from "../ElectionResume/components/WeightsTable";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getElectionResume } from "../../../services/election";

/**
 * Renders a table with the weights of the voters in an election.
 * @param {Object} props - The component props.
 * @param {string} [props.group=undefined] - The voter group to filter the weights by.
 * @param {boolean} [props.grouped=false] - Whether the weights are already grouped by voter group.
 * @returns {JSX.Element} - The component's markup.
 */
export default function ResumeWeights({ group = undefined, grouped = false }) {
  /** The initial weights of the voters. */
  const [weightsInit, setWeightsInit] = useState({});

  /** The final weights of the voters. */
  const [weightsEnd, setWeightsEnd] = useState({});

  /** The initial weights of the voters, grouped by voter group. */
  const [weightsInitGrouped, setWeightsInitGrouped] = useState({});

  /** The final weights of the voters, grouped by voter group. */
  const [weightsEndGrouped, setWeightsEndGrouped] = useState({});

  /** The weights of the voters in the election, grouped by voter group. */
  const [weightsElectionGrouped, setWeightsElectionGrouped] = useState({});

  /** The weights of the voters in the election. */
  const [weightsElection, setWeightsElection] = useState({});

  /** The short name of the election, obtained from the URL parameters. */
  const { shortName } = useParams();

  const initComponent = useCallback(() => {
    getElectionResume(shortName).then((data) => {
      const { jsonResponse } = data;
      const jsonInit = JSON.parse(jsonResponse.weights_init);
      const jsonEnd = JSON.parse(jsonResponse.weights_end);
      const jsonElection = JSON.parse(jsonResponse.weights_election);
      setWeightsInit(jsonInit);
      setWeightsEnd(jsonEnd);
      setWeightsElection(jsonElection);
      if (!grouped) {
        setWeightsInitGrouped(
          JSON.parse(jsonResponse.weights_init).voters_by_weight_init
        );
        setWeightsEndGrouped(
          JSON.parse(jsonResponse.weights_end).voters_by_weight_end
        );
        setWeightsElectionGrouped(
          JSON.parse(jsonResponse.weights_election).voters_by_weight
        );
      }
    });
  }, [grouped, shortName]);

  /**
   * Fetches the election's resume data from the server and sets the component's state with it.
   */
  useEffect(() => {
    initComponent();
  }, [initComponent]);

  /**
   * Searches for a group in the given JSON objects and sets the corresponding weights.
   * @param {Object} jsonInit - The JSON object containing the initial weights grouped by voter group.
   * @param {Object} jsonEnd - The JSON object containing the final weights grouped by voter group.
   * @param {Object} jsonElection - The JSON object containing the election weights grouped by voter group.
   */
  const searchGroup = useCallback(
    (jsonInit, jsonEnd, jsonElection) => {
      const auxGroup = group === "Sin grupo" ? "" : group;
      const init = jsonInit.voters_by_weight_init_grouped.find(
        (element) => element.group === auxGroup
      );
      setWeightsInitGrouped(init.weights);
      const electionWeight = jsonElection.voters_by_weight_grouped.find(
        (element) => element.group === auxGroup
      );
      setWeightsElectionGrouped(electionWeight ? electionWeight.weights : {});
      const end = jsonEnd.voters_by_weight_end_grouped.find(
        (element) => element.group === auxGroup
      );
      setWeightsEndGrouped(end ? end.weights : {});
    },
    [group]
  );

  const searchGroupState = useCallback(() => {
    if (
      group !== undefined &&
      weightsInit.voters_by_weight_init_grouped &&
      weightsEnd.voters_by_weight_end_grouped &&
      weightsElection.voters_by_weight_grouped
    )
      searchGroup(weightsInit, weightsEnd, weightsElection);
    else {
    }
  }, [group, weightsInit, weightsEnd, weightsElection, searchGroup]);

  useEffect(() => {
    searchGroupState();
  }, [searchGroupState]);

  return (
    <>
      {Object.keys(weightsInit).length > 0 &&
        Object.keys(weightsEnd).length > 0 && (
          <>
            <CardTitle
              title={
                "Número de votantes por ponderación " +
                (grouped ? ` - ${group}` : "")
              }
            />
            <WeightsTable
              weightsInit={weightsInitGrouped}
              weightsEnd={weightsEndGrouped}
              weightsElection={weightsElectionGrouped}
            />
          </>
        )}
    </>
  );
}
