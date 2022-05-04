import { useEffect } from "react";
import { Button } from "react-bulma-components";
import { useState } from "react";

function InputQuestion(props) {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (props.value !== undefined) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <div className="is-flex mb-2">
      <input
        value={value}
        onChange={(e) => {
          props.onChange(props.numberQuestion, e.target.value);
        }}
        className="input mr-2 input-create-question"
        type="text"
        placeholder="Respuesta"
      />
      <Button onClick={props.delete}>X</Button>
    </div>
  );
}

export default InputQuestion;
