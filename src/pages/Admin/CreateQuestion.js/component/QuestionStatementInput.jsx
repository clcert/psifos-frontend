export default function QuestionStatementInput({
    questionId, disabledEdit, statement, handleChange,
  }) {
    return (
      <div className="is-flex mb-2 ">
        <input
          id={`name-${questionId}`}
          className={"input " + (statement ? "" : "is-danger")}
          disabled={disabledEdit}
          type="text"
          placeholder="Pregunta"
          value={statement}
          onChange={handleChange}
        />
      </div>
    )
  }