function PreviousButton(props) {
  return (
    <button
      onClick={props.action}
      className="button is-medium question-button previous-button"
    >
      <span className="icon is-small">
        <i className="fas fa-2x fa-caret-left"></i>
      </span>
      <span>ANTERIOR</span>
    </button>
  );
}

export default PreviousButton;
