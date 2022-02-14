import ConfirmAlert from "./ConfirmAlert";
function ButtonAlert(props) {
  const titleAlert = props.alert ? props.alert : props.title;

  return (
    <button
      className={props.classStyle}
      onClick={() => {
        ConfirmAlert(props.title, props.message, props.action);
      }}
    >
      <span>{titleAlert}</span>
    </button>
  );
}

export default ButtonAlert;
