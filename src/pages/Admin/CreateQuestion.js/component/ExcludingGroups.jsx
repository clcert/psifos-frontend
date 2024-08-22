export default function ExcludingGroups({
    handleChange, disabledEdit, checkedOption,
  }) {
    return (
      <div className="field">
        <div className="control">
          <label className="checkbox">
            <input
              disabled={disabledEdit}
              onChange={handleChange}
              checked={checkedOption}
              type="checkbox"
              className="mr-2"
            />
            Excluir grupos
          </label>
        </div>
        <p className="help">
          Se podrá votar por una sola opción por grupo.
        </p>
      </div>
    )
  }