import MyNavbar from "../component/MyNavbar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import FooterParticipa from "../component/FooterParticipa";
import { useEffect } from "react";
import { backendIP } from "../server";
import { Container } from "react-bootstrap";

function Resultados() {
  const [showResult, setShowResult] = useState(true);
  const [prettyResult, setPrettyResult] = useState([]);
  const [electionName, setElectionName] = useState("");
  const [results, setResults] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [forLoop, setForLoop] = useState(false);
  const { uuid } = useParams();

  useEffect(function effectFunction() {
    async function getResults() {
      const resp = await fetch(backendIP + "/elections/" + uuid + "/result", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonResponse = await resp.json();

      setResults(JSON.parse(jsonResponse.result));
      setQuestions(JSON.parse(jsonResponse.questions));
    }
    getResults();
  }, []);
  return (
    <div id="content-results">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar />

          <div
            className="has-text-centered mt-6 py-3"
            id="election-title-background"
          >
            <h1
              className="title has-text-black is-size-4-mobile"
              id="election-title"
            >
              {electionName}
              <br />
              RESULTADOS PRELIMINARES
            </h1>
          </div>
        </div>
      </section>

      <section
        className="section is-flex is-align-items-center is-flex-direction-column"
        id="results-section"
      >
        {results ? (
          <>
            {questions.map((question, index) => {
              return (
                <>
                  <div className="box" id="question-box-results" key={index}>
                    <b>
                      <span className="has-text-info">
                        Pregunta #{forLoop.counter}:{" "}
                      </span>
                      {question.question}
                    </b>
                    <br />
                  </div>
                  <div className="disable-text-selection row justify-content-md-center">
                    <table
                      className="mt-2 table is-bordered is-hoverable table-booth is-bordered"
                      id="results-table"
                    >
                      <thead>
                        <tr>
                          <th className="has-text-centered">Pregunta</th>
                          <th className="has-text-centered">Resultado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results[index].map((result) => {
                          return (
                            <tr className="p-8">
                              <td>
                                <b className="p-4">1</b>
                                {console.log(index)}
                              </td>
                              <td align="right">
                                <b className="p-4">1</b>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              );
            })}
          </>
        ) : (
          <div className="box" id="not-results-box">
            <p className="is-size-3 has-text-weight-bold">
              Resultados aún no calculados. Vuelve más tarde.
            </p>
          </div>
        )}
      </section>

      <FooterParticipa />
    </div>
  );
}

export default Resultados;
