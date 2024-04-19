import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getElectionPublic } from "../../../services/election";
import NotAvalaibleMessage from "../../Booth/components/NotAvalaibleMessage";
import { electionStatus } from "../../../constants";
import CalculatedResults from "./CalculatedResults";
import { parseResult } from "./parseResult";

function NoCalculatedResults({ getElectionResult }) {
  return (
    <>
      <NotAvalaibleMessage message="Sin resultados calculados" />
      <span className="ml-3 is-size-6 mb-2" onClick={getElectionResult}>
        <Link className="link-without-line" to="">
          <i className="fa-solid fa-arrows-rotate"></i> Actualizar
        </Link>
      </span>
    </>
  );
}

function Results({ isAdmin = false }) {
  const [groupedResults, setGroupedResults] = useState([]);

  /** @state {array} election results (resume) */
  const [totalResults, setTotalResults] = useState([]);

  const [groupResult, setGroupResult] = useState([]);

  /** @state {array} election questions */
  const [questions, setQuestions] = useState([]);

  const [group, setGroup] = useState("Sin grupo");

  const [groups, setGroups] = useState([]);

  /** @state {bool} state of load info */
  const [load, setLoad] = useState(false);

  const [election, setElection] = useState({});

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  const handleTotalResults = (questionsObject, resultObject) => {
    let result = [];
    questionsObject.forEach((element, q_num) => {
      result.push(
        parseResult(
          element,
          resultObject[q_num].ans_results,
          questionsObject[q_num].include_blank_null
        )
      );
    });
    setTotalResults(result);
    setQuestions(questionsObject);
  };

  const handleGroupResults = (questionsObject, resultObject) => {
    let result = [];
    questionsObject.forEach((element, q_num) => {
      result.push(
        parseResult(
          element,
          resultObject.result[q_num].ans_results,
          questionsObject[q_num].include_blank_null
        )
      );
    });
    setGroupResult(result);
    setQuestions(questionsObject);
  };

  const getElectionResult = useCallback(async () => {
    setLoad(false);
    getElectionPublic(shortName).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        setElection(jsonResponse);
        if (
          jsonResponse.election_status === electionStatus.resultsReleased ||
          jsonResponse.election_status === electionStatus.decryptionsCombined
        ) {
          const questionsObject = JSON.parse(jsonResponse.questions);
          const resultObject = JSON.parse(jsonResponse.result);
          setGroupedResults(resultObject.results_grouped);
          setTotalResults(resultObject.results_total);
          setResultGroups(resultObject);
          handleTotalResults(questionsObject, resultObject.results_total);
          let result = resultObject.results_grouped.find((element) => {
            return element.group === "Sin grupo";
          });
          if (!result) result = resultObject.results_grouped[0];
          handleGroupResults(questionsObject, result);
        }
      }
      setLoad(true);
    });
  }, [shortName]);

  const setResultGroups = (groupedResults) => {
    const auxResult = groupedResults.results_grouped.map((result) => {
      return result.group;
    });
    setGroups(auxResult);
  };

  useEffect(() => {
    getElectionResult();
  }, [getElectionResult]);

  const initComponent = useCallback(() => {
    const result = groupedResults.find((element) => {
      return element.group === group;
    });

     if(result) handleGroupResults(questions, result);
  }, [group, groupedResults, questions]);

  useEffect(() => {
    initComponent();
  }, [initComponent]);
  return (
    <>
      {!load && <div className="spinner-animation"></div>}
      {load &&
        (election.election_status === electionStatus.resultsReleased ||
        (election.election_status === electionStatus.decryptionsCombined &&
          isAdmin) ? (
          <CalculatedResults
            election={election}
            questions={questions}
            totalResults={totalResults}
            groupResult={groupResult}
            group={group}
            groups={groups}
            setGroup={setGroup}
          />
        ) : (
          <NoCalculatedResults getElectionResult={getElectionResult} />
        ))}
    </>
  );
}

export default Results;
