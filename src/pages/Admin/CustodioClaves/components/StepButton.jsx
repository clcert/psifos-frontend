import { Link } from "react-router-dom";

function StepButton(props) {
  return (
    <div className="centered-button">
      <Link
        id={props.id}
        className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
        style={{
          textDecoration: "None",
          textTransform: "uppercase",
          whiteSpace: "normal",
          height: "3em",
        }}
        to={props.linkTo}
      >
        {props.text}
      </Link>
    </div>
  );
}

export default StepButton;
