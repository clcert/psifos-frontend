import { useState, useEffect, useCallback } from "react";
import { Link, useParams } from "react-router-dom";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import SubNavbar from "../component/SubNavbar";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { getElection } from "../../../services/election";
import ResultTable from "./components/ResultTable";

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

  /** @state {bool} state of load info */
  const [load, setLoad] = useState(false);

  /** @urlParam {string} uuid of election */
  const { uuid } = useParams();

  const getElectionResult = useCallback(async () => {
    getElection(uuid).then((election) => {
      const { resp, jsonResponse } = election;
      if (resp.status === 200) {
        if (jsonResponse.election_status === "Decryptions combined") {
          setElection(jsonResponse);
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
    <div id="content-home-admin">
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
      </section>

      <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
    </div>
  );
}

export default Resultados;
