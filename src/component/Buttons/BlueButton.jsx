import { Link } from "react-router-dom";
import { Button } from "react-bulma-components";

function BlueButton({id, linkTo, text, handleClick, ...props}) {
  return (
    <Button
        className="btn-fixed button-custom"
        onClick={handleClick}
        {...props}
    >
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
    </Button>
  );
}

export default BlueButton;
