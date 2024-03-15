import { useEffect, useState } from "react";

export default function CotedInput({
    label, isDisabled, value, inputId,
    placeholder, handleInput, checkOptions, numberOfAns,
    minCoteCondition, minCoteWarningMessage,
    maxCoteCondition, maxCoteWarningMessage,
  }) {
    const [warningText, setWarningText] = useState(false);
  
    useEffect(() => {
      let wt = false
      if (!isDisabled){
        if (minCoteCondition) {
          wt = minCoteWarningMessage;
          checkOptions(false);
        }
        else if (maxCoteCondition){
          wt = maxCoteWarningMessage;
          checkOptions(false);
        }
      }
      setWarningText(wt);
    }, [value, isDisabled, numberOfAns]);
  
    useEffect(() => {
      checkOptions(!Boolean(warningText));
    }, [warningText])
  
    return (
      <div className="column" style={{paddingLeft: "0px"}}>
        <div className="field">
          <label className="label">{label}</label>
          <div className="control">
            <input
              id={inputId}
              disabled={isDisabled}
              value={value}
              className={`input ${warningText && "is-danger"}`}
              type="number"
              placeholder={placeholder}
              onChange={handleInput}
            />
          </div>
          {warningText && (
            <p className="help is-danger">{warningText}</p>
          )}
        </div>
      </div>
    )
  }