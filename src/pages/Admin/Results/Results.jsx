import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getElectionPublic } from "../../../services/election";
import { getPercentage } from "../utils";
import NotAvalaibleMessage from "../../Booth/components/NotAvalaibleMessage";
import { electionStatus, permanentOptionsList } from "../../../constants";
import CalculatedResults from "./CalculatedResults";

const analizeQuestionResult = (question, votesPerAns, includeWhiteNull) => {
  const noNullWhiteAns =
    includeWhiteNull === "True" ? votesPerAns.slice(0, -2) : votesPerAns;
  const nValidVotes = votesPerAns.reduce((n, a) => n + parseInt(a), 0);
  const nCastVotes = noNullWhiteAns.reduce((n, a) => n + parseInt(a), 0);

  let result = [];
  question.closed_options.forEach((answer, index) => {
    const obj = {
      Respuesta: answer,
      Votos: parseInt(votesPerAns[index]),
      PorcentajeSobreVotosValidos: getPercentage(
        votesPerAns[index],
        nValidVotes
      ),
    };
    if (permanentOptionsList.includes(answer)) {
      result.push(obj);
    } else {
      result.push({
        ...obj,
        PorcentajeSobreVotosEmitidos: getPercentage(
          votesPerAns[index],
          nCastVotes
        ),
      });
    }
  });
  return result;
};

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

function Results() {
  /** @state {array} election results (resume) */
  const [results, setResults] = useState([]);

  /** @state {array} election questions */
  const [questions, setQuestions] = useState([]);

  /** @state {bool} state of load info */
  const [load, setLoad] = useState(false);

  const [election, setElection] = useState({});

  /** @urlParam {string} shortName of election */
  const { shortName } = useParams();

  const handleResults = (questionsObject, resultObject) => {
    let result = [];
    questionsObject.forEach((element, q_num) => {
      result.push(
        analizeQuestionResult(
          element,
          resultObject[q_num].ans_results,
          questionsObject[q_num].include_blank_null
        )
      );
    });
    setResults(result);
    setQuestions(questionsObject);
  };

  const getElectionResult = useCallback(async () => {
    setLoad(false);
    getElectionPublic(shortName).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        setElection(jsonResponse);
        if (jsonResponse.election_status === electionStatus.resultsReleased) {
          const questionsObject = JSON.parse(jsonResponse.questions);
          const resultObject = JSON.parse(jsonResponse.result);
          handleResults(questionsObject, resultObject);
        }
      }
      setLoad(true);
    });
  }, [shortName]);

  useEffect(() => {
    getElectionResult();
  }, [getElectionResult]);
  return (
    <>
      {!load && <div className="spinner-animation"></div>}
      {load && election.election_status === electionStatus.resultsReleased ? (
        <CalculatedResults
          election={election}
          questions={questions}
          results={results}
        />
      ) : (
        <NoCalculatedResults getElectionResult={getElectionResult} />
      )}
    </>
  );
}

export default Results;
