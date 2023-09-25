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
              {/* <option value="open_question">Pregunta abierta</option> */}
              <option value="closed_question">Pregunta cerrada</option>
              <option value="mixnet_question">Pregunta mixnet</option>
              <option value="stvnc_question">Pregunta con ranking preferencial</option>
            </select>
          </div>
        </div>
      </div>
    )
  }