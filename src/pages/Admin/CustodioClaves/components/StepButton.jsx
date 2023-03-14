import { Link } from "react-router-dom";

function StepButton(props) {
  return (
    <Link
      className="is-medium step-button my-2 p-2"
      style={{ textDecoration: "None", color: "white" }}
      to={props.linkTo}
    >
      <div className="d-flex">
        ETAPA {props.step}: {props.text}
      </div>
    </Link>
  );
}

export default StepButton;
