import { questionsInfo } from "../../../../constants";

export default function QuestionTypeSelector({
  disabledEdit, handleChange, questionType,
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
              <option key={index} value={q.type}>
                {q.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
