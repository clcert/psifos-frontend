export default function ClassicSelector({
  handleChange, options, value, selectorName, selectorLabel,
}) {
    const optionsArray = Object.entries(options);
    return (
      <div className="selector-container">
        {selectorLabel && <label style={{marginRight: "10px"}}>
          {selectorLabel}
        </label>}
        <div className="control">
          <div className="select">
            <select
              onChange={(event) => handleChange(event.target.value)}
              name={selectorName}
              id={selectorName}
              value={value}
            >
              {optionsArray.map(([id, label]) => {
                return (
                    <option value={id} key={`selector-option-${id}`}>
                      {label}
                    </option>
                );
              })}
            </select>
          </div>
        </div>
      </div>
    );
  }