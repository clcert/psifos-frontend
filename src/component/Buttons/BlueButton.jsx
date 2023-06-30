import { Link } from "react-router-dom";

function BlueButton({id, linkTo, text}) {
  return (
    <Link
        id={id}
        className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
        style={{
            textDecoration: "None",
            textTransform: "uppercase",
            whiteSpace: "normal",
            height: "3em",
        }}
        to={linkTo}
    >
        {text}
    </Link>
  );
}

export default BlueButton;
