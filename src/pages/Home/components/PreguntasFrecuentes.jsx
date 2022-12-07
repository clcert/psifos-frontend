import { useInViewport } from "react-in-viewport";
import React, { useRef } from "react";

function PreguntasFrecuentes(props) {
  const myRef = useRef();
  const [showAnimation, setShowAnimation] = React.useState(false);
  const { inViewport } = useInViewport(myRef);
  if (inViewport && !showAnimation) {
    setShowAnimation(true);
  }
  return (
    <article
      className={
        "message " + (showAnimation ? "slide-down-activate" : "slide-down-enter")
      }
      ref={myRef}
    >
      <div className="message-header">
        <p>{props.pregunta}</p>
      </div>
      <div className="message-body">{props.respuesta}</div>
    </article>
  );
}

export default PreguntasFrecuentes;
