import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { backendIP } from "../../../server";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import SubNavbar from "../component/SubNavbar";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";

function Resultados() {
  /**
   * View for results of an election
   */

  /** @state {string} name election */
  const [electionName, setElectionName] = useState("test");

  /** @state {array} election results (resume) */
  const [results, setResults] = useState([]);

  /** @state {array} election questions */
  const [questions, setQuestions] = useState([]);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(function effectFunction() {
    async function getResults() {
      /**
       * Get results of an election
       */

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
          <NavbarAdmin />

          <Title
            namePage="Resultados Preliminares"
            nameElection={electionName}
          />
        </div>
      </section>

      <SubNavbar active={5} />

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
                        Opción n° {index + 1}:{" "}
                      </span>
                      {question.question}
                    </b>
                    <br />
                  </div>
                  <div className="disable-text-selection row justify-content-md-center">
                    <table className="pretty table is-hoverable voters-table">
                      <thead>
                        <tr>
                          <th className="has-text-centered">Respuesta</th>
                          <th className="has-text-centered">Resultado</th>
                        </tr>
                      </thead>
                      <tbody>
                        {results[index].map((result, index) => {
                          return (
                            <tr className="p-8" key={index}>
                              <td>
                                <b className="p-4">1</b>
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

      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default Resultados;
