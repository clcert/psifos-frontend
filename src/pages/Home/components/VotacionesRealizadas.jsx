import { useInViewport } from "react-in-viewport";
import React, { useRef } from "react";

function VotacionesRealizadas(props) {
  const elections = require("../../../static/data/elections.json");

  const myRef = useRef();
  const [showAnimation, setShowAnimation] = React.useState(false);
  const { inViewport } = useInViewport(myRef);
  if (inViewport && !showAnimation) {
    setShowAnimation(true);
  }
  return (
    <div>
      
    </div>
  );
}

export default VotacionesRealizadas;
