import ConfirmAlert from "./ConfirmAlert";
function TextAlert(props) {
  const titleAlert = props.alert ? props.alert : props.title;

  return (
    <a
      style={{ color: "#00b6fe" }}
      onClick={() => {
        ConfirmAlert(props.title, props.message, props.action);
      }}
    >
      {titleAlert}
    </a>
  );
}

export default TextAlert;
