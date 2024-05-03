export default function ClassicSelector({
  handleChange, options, value, selectorName, selectorLabel,
}) {
    const optionsArray = Object.entries(options);
    return (
      <div className="selector-container">
        {selectorLabel && <label>{selectorLabel}</label>}
        <div className="control ml-2">
          <div className="select">
            <select
              onChange={handleChange}
              name={selectorName}
              id={selectorName}
              value={value}
            >
              {optionsArray.map(([id, label]) => {
                return (
                    <option value={id}>{label}</option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    );
  }