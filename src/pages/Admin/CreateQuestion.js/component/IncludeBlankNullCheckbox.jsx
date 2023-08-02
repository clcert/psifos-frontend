export default function IncludeBlankNullCheckbox({
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
            Incluir voto nulo y blanco
          </label>
        </div>
        <p className="help">
          Se podrá votar por las opciones nulo y blanco.
        </p>
      </div>
    )
  }