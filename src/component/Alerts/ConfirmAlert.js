import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

function ConfirmAlert(title, message,action) {
  return confirmAlert({
    customUI: ({ onClose }) => {
      return (
        <div className="confirm-alert">
          <h2>{title}</h2>
          <hr />
          <p style={{ width: "500px", fontSize: "20px" }}>{message}</p>

          <div className="d-flex justify-content-center">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold"
              onClick={action}
            >
              Yes
            </button>
            <button
              className="ml-3 button review-buttons previous-button has-text-white has-text-weight-bold"
              onClick={onClose}
            >
              No
            </button>
          </div>
        </div>
      );
    },
  });
}
export default ConfirmAlert;
