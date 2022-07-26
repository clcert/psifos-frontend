import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import SubNavbar from "../component/SubNavbar";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { getElection } from "../../../services/election";

function Resultados() {
  /**
   * View for results of an election
   */

  /** @state {string} name election */
  const [election, setElection] = useState("");

  /** @state {array} election results (resume) */
  const [results, setResults] = useState([]);

  /** @state {array} election questions */
  const [questions, setQuestions] = useState([]);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  useEffect(() => {
    getElection(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        if (jsonResponse.election_status === "Decryptions combined") {
          setElection(jsonResponse);
          setQuestions(JSON.parse(jsonResponse.questions));
          setResults(JSON.parse(jsonResponse.result));
        }
      }
    });
  }, []);
  return (
    <div id="content-results">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />

          <Title
            namePage="Resultados Preliminares"
            nameElection={election.name}
          />
        </div>
      </section>

      <SubNavbar active={5} />

      <section
        className="section is-flex is-align-items-center is-flex-direction-column"
        id="results-section"
      >
        {results.length > 0 ? (
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
                    <table className="pretty table is-hoverable voters-table">
                      <thead>
                        <tr>
                          <th className="has-text-centered">Respuesta</th>
                          <th className="has-text-centered pl-4 pr-4">
                            Resultado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {results[index].ans_results.map((result, index) => {
                          return (
                            <tr className="has-text-centered" key={index}>
                              <td>
                                <b className="p-4">
                                  {question.closed_options[index]}
                                </b>
                              </td>
                              <td>
                                <b className="p-4">{result}</b>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
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
