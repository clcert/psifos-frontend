import { Link } from "react-router-dom";

function SmallStepButton(props) {
    return (
      <Link
        className="is-normal button is-info is-light is-outlined py-2 my-3"
        style={{ textDecoration: "None", textTransform: "uppercase", whiteSpace: "normal", height: "fit-content", width: "fit-content", order: 1 }}
        to={props.linkTo}
      >
          {props.text} 
      </Link>
    );
  }

export default SmallStepButton;  
