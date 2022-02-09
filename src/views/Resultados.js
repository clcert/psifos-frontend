import MyNavbar from "../component/MyNavbar";
import { useState } from "react";
import { useParams } from "react-router-dom";
import FooterParticipa from "../component/FooterParticipa";

function Resultados() {
  const [showResult, setShowResult] = useState(false);
  const [prettyResult, setPrettyResult] = useState([]);
  const [electionName, setElectionName] = useState("");
  const [forLoop, setForLoop] = useState(false);
  const { uuid } = useParams();
  return (
    <div id="content-results">
      <section id="header-section" class="parallax hero is-medium">
        <div class="hero-body pt-0 px-0 header-hero">
          <MyNavbar />

          <div
            class="has-text-centered mt-6 py-3"
            id="election-title-background"
          >
            <h1
              class="title has-text-black is-size-4-mobile"
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
        class="section is-flex is-align-items-center is-flex-direction-column"
        id="results-section"
      >
        {showResult ? (
          <>
            {prettyResult.map((question, index) => {
              return (
                <>
                  <div class="box" id="question-box-results">
                    <b>
                      <span class="has-text-info">
                        Pregunta #{forLoop.counter}:{" "}
                      </span>
                      {question.question}
                    </b>
                    <br />
                  </div>
                  <table class="table is-bordered mb-6" id="results-table">
                    <tbody>
                      {question.answer.map((answer) => {
                        <tr>
                          <td>
                            <b>{answer.answer}</b>
                          </td>
                          <td align="right">
                            <b>{answer.count}</b>
                          </td>
                        </tr>;
                      })}
                    </tbody>
                  </table>
                </>
              );
            })}
          </>
        ) : (
          <div class="box" id="not-results-box">
            <p class="is-size-3 has-text-weight-bold">
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
