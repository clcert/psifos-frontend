import { Link } from "react-router-dom";

function StepButton(props) {
  return (
    <Link
      className="is-large button is-info is-light is-outlined py-2 my-3"
      style={{ textDecoration: "None", textTransform: "uppercase", whiteSpace: "normal", height: "3em" }}
      to={props.linkTo}
    >
        {props.text} 
    </Link>
  );
}

export default StepButton;
