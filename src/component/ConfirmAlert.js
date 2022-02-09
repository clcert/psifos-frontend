import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css"; // Import css

function ConfirmAlert(props) {
  const titleAlert = props.alert ? props.alert : props.title;
  const submit = () => {
    confirmAlert({
      customUI: ({ onClose }) => {
        return (
          <div className="confirm-alert">
            <h2>{props.title}</h2>
            <hr />
            <p style={{ width: "500px", fontSize: "20px" }}>{props.message}</p>

            <div className="d-flex justify-content-center">
              <button
                className="button review-buttons previous-button has-text-white has-text-weight-bold"
                onClick={props.action}
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
  };

  return (
    <a style={{color: "#00b6fe"}} onClick={submit}>
      {props.button ? (
        <>
          <button className="button mb-4">
            <span>{titleAlert}</span>
          </button>
        </>
      ) : (
        titleAlert
      )}
    </a>
  );
}

export default ConfirmAlert;
