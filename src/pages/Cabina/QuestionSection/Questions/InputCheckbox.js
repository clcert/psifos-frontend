function InputCheckbox(props) {
  return (
    <>
      <label id="" className="checkbox question-answer p-2">
        <input
          type="checkbox"
          className="ballot_answer"
          id=""
          name=""
          value="yes"
        />
        <span className="is-size-4">{props.answer}</span>
      </label>
    </>
  );
}

export default InputCheckbox;
