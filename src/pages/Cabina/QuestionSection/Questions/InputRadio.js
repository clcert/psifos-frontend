function InputRadio(props) {
  return (
    <>
      <label id="" className="radio question-answer p-2">
        <input className="custom-answer" type="radio" id="" name="answer" value={props.value} onclick="" />
        <span className="is-size-4">{props.answer}</span>
      </label>
    </>
  );
}
export default InputRadio;
