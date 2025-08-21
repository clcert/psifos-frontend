import { electionType, questionsInfo } from "../../../../constants";

export default function QuestionTypeSelector({
  disabledEdit, handleChange, questionType, election
}) {
  return (
    <div className="field">
      <label className="label">Tipo de pregunta</label>
      <div className="control">
        <div className="select">
          <select
            id="select_type_question"
            disabled={disabledEdit}
            className="mr-2"
            onChange={handleChange}
            value={questionType}
          >
            {questionsInfo.map((q, index) => (
              q.type_election.includes(electionType[election.type]) && (
              <option key={index} value={q.type}>
                {q.name}
              </option>
            )))}
          </select>
        </div>
      </div>
    </div>
  );
}
