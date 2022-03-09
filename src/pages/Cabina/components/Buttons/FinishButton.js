import { useState } from "react";

function FinishButton(props) {
  const [showModal, setShowModal] = useState(false);

  return (
    <button
      onClick={() => {
        props.action();
        setShowModal(true);
      }}
      className="button is-medium question-button proceed-button"
    >
      <span>FINALIZAR</span>
      <span className="icon is-small">
        <i className="fas fa-2x fa-caret-right"></i>
      </span>
    </button>
  );
}
export default FinishButton;
