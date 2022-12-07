import { useCallback } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getElectionPublic } from "../../../../services/election";
import ResultTable from "./ResultTable";

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
    getElectionPublic(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        if (jsonResponse.election_status === "Decryptions combined") {
          setQuestions(JSON.parse(jsonResponse.questions));
          setResults(JSON.parse(jsonResponse.result));
        }
      }
      setLoad(true);
    });
  }, [uuid]);

  useEffect(() => {
    getElectionResult();
  }, [getElectionResult]);
  return (
    <>
      {!load && <div className="spinner-animation"></div>}
      {results.length > 0 && load && (
        <>
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
                <div className="disable-text-selection row justify-content-md-center">
                  <ResultTable result={results[index]} question={question} />
                </div>
              </div>
            );
          })}
        </>
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
            <p className="is-size-3 has-text-weight-bold">
              Resultados aún no calculados. Vuelve más tarde.
            </p>
          </div>
        </>
      )}
    </>
  );
}

export default Results;
