
function FinishButton(props) {


  return (
    <button
      onClick={() => {
        props.action();
      }}
      className="button is-medium question-button proceed-button"
      name="button-finish"
    >
      <span>FINALIZAR</span>
      <span className="icon is-small">
        <i className="fas fa-2x fa-caret-right"></i>
      </span>
    </button>
  );
}
export default FinishButton;
