import { Button } from "react-bulma-components";

function InputQuestion(props) {
  return (
    <div className="is-flex mb-2">
      <input className="input mr-2 input-create-question" type="text" placeholder="Respuesta" />
      <Button onClick={props.delete}>X</Button>
    </div>
  );
}

export default InputQuestion;
