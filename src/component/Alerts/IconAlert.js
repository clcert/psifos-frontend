import ConfirmAlert from "./ConfirmAlert";
function IconAlert(props) {
  const titleAlert = props.alert ? props.alert : props.title;

  return (
    <i className={props.icon + " alert-buttons"} onClick={props.action}>
      <span>{titleAlert}</span>
    </i>
  );
}

export default IconAlert;
