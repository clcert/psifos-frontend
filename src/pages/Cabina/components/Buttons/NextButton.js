function NextButton(props) {
  return (
    <button
      onClick={props.action}
      className="button is-medium question-button next-button"
    >
      <span>SIGUIENTE</span>
      <span className="icon is-small">
        <i className="fas fa-2x fa-caret-right"></i>
      </span>
    </button>
  );
}
export default NextButton;
