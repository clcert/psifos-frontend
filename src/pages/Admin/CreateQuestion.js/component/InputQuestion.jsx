import { useEffect } from "react";
import { Button } from "react-bulma-components";
import { useState } from "react";

function InputQuestion(props) {
  /** @state {string} answers text */
  const [value, setValue] = useState("");

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <div className="is-flex mb-2">
      <input
        disabled={props.disabledEdit}
        value={value}
        onChange={(e) => {
          props.onChange(props.numberQuestion, e.target.value);
        }}
        className="input"
        type="text"
        placeholder="Respuesta"
      />
      <Button disabled={props.disabledEdit} onClick={props.delete}>
        X
      </Button>
    </div>
  );
}

export default InputQuestion;
