import { Link } from "react-router-dom";

function StepButton(props) {
  if (!props.disabled) {
    return (
      <Link
        className="button is-medium step-button my-2"
        style={{ textDecoration: "None", color: "white" }}
        to={props.linkTo}
      >
        <span>ETAPA {props.step}:&nbsp;</span>
        <span>{props.text}</span>
      </Link>
    );
  }

  return (
    <Link
      className="button is-medium step-button my-2 inactive-button"
      style={{ textDecoration: "None", color: "white" }}
      to="/"
      onClick={(event) => event.preventDefault()}
    >
      <span>ETAPA {props.step}:&nbsp;</span>
      <span>{props.text}</span>
    </Link>
  );
}

export default StepButton;
