import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getElectionPublic,
  getElectionResume,
} from "../../../../services/election";
import ResumeTable from "../../ElectionResume/components/ResumeTable";
import PsifosTable from "./PsifosTable";
import { getPercentage } from "../../utils";
import WeightsTable from "../../ElectionResume/components/WeightsTable";
import NotAvalaibleMessage from "../../../Booth/components/NotAvalaibleMessage";
import { permanentOptionsList } from "../../../../constants";

const analizeQuestionResult = (
  question,
  votesPerAns,
  includeBlankNull,
) => {
  const noNullWhiteAns = includeBlankNull === "True"
  ? votesPerAns.slice(0, -2) : votesPerAns
  const nValidVotes = votesPerAns.reduce((n, a) => n + parseInt(a), 0);
  const nCastVotes = noNullWhiteAns.reduce((n, a) => n + parseInt(a), 0);
  
  let result = [];
  question.closed_options.forEach((answer, index) => {
    const obj = {
      Respuesta: answer,
      Votos: parseInt(votesPerAns[index]),
      PorcentajeSobreVotosValidos: getPercentage(votesPerAns[index], nValidVotes),
    }
    if (permanentOptionsList.includes(answer)) {
      result.push(obj)
    }
    else {
      result.push({
        ...obj,
        PorcentajeSobreVotosEmitidos: getPercentage(votesPerAns[index], nCastVotes),
      })
    }
  });
  return result
}

function BoxPerQuestion({
  question, index, election, result, 
}) {
  const [percentageOption, setPercentageOpcion] = useState('votosValidos')

  const resultByOption = result.reduce((accumulator, currentValue) => {
    const {
      PorcentajeSobreVotosValidos, PorcentajeSobreVotosEmitidos, ...infoGeneral
    } = currentValue
    if (percentageOption === 'votosValidos') {
      accumulator.push({...infoGeneral, Porcentaje: PorcentajeSobreVotosValidos})
    }
    else if (percentageOption === 'votosEmitidos' && PorcentajeSobreVotosEmitidos) {
      accumulator.push({...infoGeneral, Porcentaje: PorcentajeSobreVotosEmitidos})
    }
    else {
      accumulator.push(infoGeneral)
    }
    return accumulator
  }, [])
  return (
    <div
      className="box question-box-results"
      id="question-box-results"
    >
      <QuestionTitle index={index} text={question.q_text} />
      <QuestionTables
        election={election}
        result={resultByOption}
        question={question}
      />
      {question.include_blank_null === "True" && <PercentageOptions
        handleChange={(e) => setPercentageOpcion(e.target.value)}
        currentValue={percentageOption}
      />}
    </div>
  )
}

function PercentageOptions({
  handleChange, currentValue,
}) {
  return (
    <div className="statistics-votes-by-time">
      <label>Total considerado para porcentajes:</label>
      <div className="control ml-2">
        <div className="select">
          <select
            onChange={handleChange}
            name="delta-time"
            id="time"
            value={currentValue}
          >
            <option value="votosValidos">Cantidad de votos válidamente emitidos</option>
            <option value="votosEmitidos">Cantidad de votos emitidos (incluye blancos y nulos)</option>
          </select>
        </div>
      </div>
    </div>
  )
}

function TitleCard({ title }) {
  return (
    <div className="d-flex py-2">
      <h1 className="title is-size-3">{title}</h1>
    </div>
  );
}

function ResumenElection() {
  return (
    <>
      <TitleCard title="Resumen elección" />
      <ResumeTable className="pt-4" />
    </>
  );
}

function QuestionTitle({ index, text }) {
  return (
    <>
      <div key={index} className="is-size-5 question">
        <span className="has-text-info question-number">
          Pregunta n°{index + 1}
          {":"}
        </span>
        <div> {text} </div>
      </div>
    </>
  );
}

function QuestionTables({ result, question, election }) {
  return (
    <div className="disable-text-selection justify-content-md-center columns question-columns">
      <div className="column justify-content-center">
        <PsifosTable
          election={election}
          data={
            question.include_blank_null === "True"
              ? result.slice(0, -2)
              : result
          }
        />
      </div>
      {question.include_blank_null === "True" && (
        <div className="column justify-content-center">
          <PsifosTable election={election} data={result.slice(-2)} />
        </div>
      )}
    </div>
  );
}

function ResultsPerQuestion({ questions, results, election }) {
  return (
    <>
      <TitleCard title="Resultados por pregunta" />
      {questions.map((question, index) => {
        return (
          <BoxPerQuestion
            question={question}
            index={index}
            election={election}
            result={results[index]}
            key={index}
          />
        );
      })}
    </>
  );
}

function WeightsTableSection() {
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
      <TitleCard title="Número de votantes por ponderación" />
      <WeightsTable
        weightsInit={weightsInit}
        weightsEnd={weightsEnd}
        weightsElection={weightsElection}
      />
    </>
  );
}

function CalculatedResults({ questions, results, election }) {
  return (
    <div>
      <div className="box ">
        <ResumenElection />
      </div>
      {election.max_weight !== 1 && (
        <div className="box ">
          <WeightsTableSection />
        </div>
      )}
      <div className="box ">
        <ResultsPerQuestion
          election={election}
          questions={questions}
          results={results}
        />
      </div>
    </div>
  );
}

function NoCalculatedResults({ getElectionResult }) {
  return (
    <>
      <NotAvalaibleMessage
        message="Sin resultados calculados"
      />
      <span
        className="ml-3 is-size-6 mb-2"
        onClick={getElectionResult}
      >
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
      result.push(analizeQuestionResult(
        element,
        resultObject[q_num].ans_results,
        questionsObject[q_num].include_blank_null,
      ))
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
        if (jsonResponse.election_status === "Decryptions combined") {
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
      {results.length > 0 && load && (
        <CalculatedResults
          election={election}
          questions={questions}
          results={results}
        />
      )}
      {results.length === 0 && load && (
        <NoCalculatedResults getElectionResult={getElectionResult} />
      )}
    </>
  );
}

export default Results;
