import { useState } from "react";
import PsifosTable from "./components/PsifosTable";
import CardTitle from "./components/CardTitle";
import { getResponseWithoutGroup } from "../utils";

function PercentageOptions({ handleChange, currentValue }) {
  return (
    <div className="percentage-selector-container">
      <label>
        ¿Desea considerar los votos blancos y nulos en el porcentaje desplegado?
      </label>
      <div className="control ml-2">
        <div className="select">
          <select
            onChange={handleChange}
            name="delta-time"
            id="time"
            value={currentValue}
          >
            <option value="votosValidos">Si</option>
            <option value="votosEmitidos">No</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function QuestionTitle({ index, text }) {
  return (
    <div key={index} className="is-size-5 question">
      <span className="has-text-info question-number">
        Pregunta n°{index + 1}
        {":"}
      </span>
      <div> {text} </div>
    </div>
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

function BoxPerQuestion({ question, index, election, result }) {
  const [percentageOption, setPercentageOpcion] = useState("votosValidos");

  const resultByOption = result.reduce((accumulator, currentValue) => {
    const {
      PorcentajeSobreVotosValidos,
      PorcentajeSobreVotosEmitidos,
      Respuesta,
      Votos,
    } = currentValue;

    const infoGeneral = {
      Respuesta:
        question.q_type === "mixnet_question"
          ? getResponseWithoutGroup(Respuesta)
          : Respuesta,
      Votos,
    };

    if (percentageOption === "votosValidos") {
      accumulator.push({
        ...infoGeneral,
        Porcentaje: PorcentajeSobreVotosValidos,
      });
    } else if (
      percentageOption === "votosEmitidos" &&
      PorcentajeSobreVotosEmitidos
    ) {
      accumulator.push({
        ...infoGeneral,
        Porcentaje: PorcentajeSobreVotosEmitidos,
      });
    } else {
      accumulator.push(infoGeneral);
    }
    return accumulator;
  }, []);

  return (
    <div className="box question-box-results" id="question-box-results">
      <QuestionTitle index={index} text={question.q_text} />
      <QuestionTables
        election={election}
        result={resultByOption}
        question={question}
      />
      {question.include_blank_null === "True" && (
        <PercentageOptions
          handleChange={(e) => setPercentageOpcion(e.target.value)}
          currentValue={percentageOption}
        />
      )}
    </div>
  );
}

export default function ResultsPerQuestion({ questions, results, election }) {
  return (
    <>
      <CardTitle title="Resultados por pregunta" />
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
