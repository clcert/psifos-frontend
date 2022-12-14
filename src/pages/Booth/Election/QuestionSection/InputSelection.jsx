import InputCheckbox from "./Questions/InputCheckbox";
import InputRadio from "./Questions/InputRadio";

function InputSelection(props) {
  <div>
    {props.question.min_answers === "1" &&
    props.question.max_answers === "1" ? (
      <InputRadio
        index={props.index}
        addAnswer={props.addAnswer}
        value={String(props.index)}
        closed_options={props.question.closed_options}
      />
    ) : (
      <InputCheckbox
        index={props.index}
        addAnswer={props.addAnswer}
        value={String(props.index)}
        closed_options={props.question.closed_options}
      />
    )}
  </div>;
}

export default InputSelection;
