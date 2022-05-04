import { useInViewport } from "react-in-viewport";
import React, { useRef } from "react";

function TeamComponent(props) {
  const myRef = useRef();
  const [showAnimation, setShowAnimation] = React.useState(false);
  const { inViewport, enterCount, leaveCount } = useInViewport(myRef);
  if (inViewport && !showAnimation) {
    setShowAnimation(true);
  }
  return (
    <div
      className={
        "box has-text-centered team-box " +
        (showAnimation ? "slide-up-activate" : "slide-up-enter")
      }
      ref={myRef}
    >
      <figure className="image">
        <img className="" src={props.image} alt=""/>
      </figure>
      <p
        className="
    title
    is-size-5
    pt-4
    is-color-blue
    has-text-weight-bold
    "
      >
        {props.name}
      </p>
      <p className="subtitle is-color-blue">{props.rol}</p>
    </div>
  );
}

export default TeamComponent;
