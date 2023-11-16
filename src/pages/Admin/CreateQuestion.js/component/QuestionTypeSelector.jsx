import { questionsInfo } from "../../../../constants"

export default function QuestionTypeSelector({
    disabledEdit, handleChange, typeQuestion,
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
              value={typeQuestion}
            >
              {questionsInfo.map((q) => (
                <option value={q.type}>{q.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    )
  }