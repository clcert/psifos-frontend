import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getElectionPublic } from "../../../../services/election";
import ResumeTable from "../../ElectionResume/components/ResumeTable";
import PsifosTable from "./PsifosTable";

function Results(props) {
  /** @state {array} election results (resume) */
  const [results, setResults] = useState([]);

  /** @state {array} election questions */
  const [questions, setQuestions] = useState([]);

  /** @state {bool} state of load info */
  const [load, setLoad] = useState(false);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  const getElectionResult = useCallback(async () => {
    setLoad(false);
    getElectionPublic(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        if (jsonResponse.election_status === "Decryptions combined") {
          const questionsObject = JSON.parse(jsonResponse.questions);
          const resultObject = JSON.parse(jsonResponse.result);
          createResults(questionsObject, resultObject);
        }
      }
      setLoad(true);
    });
  }, [uuid]);

  const createResults = (questionsObject, resultObject) => {
    let result = [];
    questionsObject.forEach((element, q_num) => {
      let q_result = [];
      element.closed_options.forEach((answer, index) => {
        q_result.push({
          Respuesta: answer,
          Resultado: resultObject[q_num].ans_results[index],
        });
      });
      result.push(q_result);
    });
    setResults(result);
    setQuestions(questionsObject);
  };

  useEffect(() => {
    getElectionResult();
  }, [getElectionResult]);
  return (
    <>
      {!load && <div className="spinner-animation"></div>}
      {results.length > 0 && load && (
        <div>
          <div className="d-flex justify-content-center">
            <h1 className="title is-size-3">Resumen elección</h1>
          </div>
          <ResumeTable className="pt-4" />
          <div className="d-flex justify-content-center py-4">
            <h2 className="title is-size-4">Resultados por pregunta</h2>
          </div>
          {questions.map((question, index) => {
            return (
              <div key={index}>
                <div className="box" id="question-box-results" key={index}>
                  <b>
                    <span className="has-text-info">
                      Pregunta n° {index + 1}:{" "}
                    </span>
                    {question.q_text}
                  </b>
                  <br />
                </div>
                <div className="disable-text-selection justify-content-md-center">
                  <div className="columns">
                    <div className="column justify-content-center">
                      <PsifosTable
                        data={
                          questions[index].include_blank_null === "True"
                            ? results[index].slice(0, -2)
                            : results[index]
                        }
                      />
                    </div>
                    {questions[index].include_blank_null === "True" && (
                      <div className="column justify-content-center">
                        <PsifosTable data={results[index].slice(-2)} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {results.length === 0 && load && (
        <>
          <span
            className="ml-3 is-size-6 mb-2"
            onClick={() => {
              getElectionResult();
            }}
          >
            <Link className="link-without-line" to="">
              <i className="fa-solid fa-arrows-rotate"></i> Actualizar
            </Link>
          </span>
          <div className="box" id="not-results-box">
            <p className="is-size-3 has-text-weight-bold mb-0 has-text-centered">
              Resultados aún no calculados
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default Results;
