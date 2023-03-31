import { Link } from "react-router-dom";

function StepButton(props) {
  return (
    <Link
      className="is-large button step-button my-2 p-3"
      style={{ textDecoration: "None" }}
      to={props.linkTo}
    >
      <div className="d-flex">
        {props.text}
      </div>
    </Link>
  );
}

export default StepButton;
