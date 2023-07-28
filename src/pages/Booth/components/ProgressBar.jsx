import React from "react";
import revisionBlue from "../../../static/svg/ProcesoVotacion/revision_blue.svg";
import revisionGray from "../../../static/svg/ProcesoVotacion/revision_gray.svg";
import revisionGreen from "../../../static/svg/ProcesoVotacion/revision_green.svg";
import seleccionBlue from "../../../static/svg/ProcesoVotacion/seleccion_blue.svg";
import seleccionGray from "../../../static/svg/ProcesoVotacion/seleccion_gray.svg";
import seleccionGreen from "../../../static/svg/ProcesoVotacion/seleccion_green.svg";

function StepImage({phase, image}) {
  return (
    <div
      className={
        `phase ${phase} column ${phase !== 3 && " hide-mobile"}`
      }
    >
      <img src={image} className="spinner" alt="" style={{ maxWidth: "85%" }} />
    </div>
  )
}

function ProgressBar(props) {
  const  phases = {
    1: {
      future: seleccionGray,
      current: seleccionBlue,
      past: seleccionGreen,
    },
    2: {
      future: revisionGray,
      current: revisionBlue,
      past: revisionGreen,
    },
  }

  return (
    props.phase > 2 ? <div /> :
    <section className="section px-0" id="progress-bar">
      <div className="line-1 is-hidden-touch"/>
      <div className="container has-text-centered progress-container">
        <div className="columns progress-bar-items">
          {Object.keys(phases).map(key => {
            const phaseNumber = parseInt(key, 10)
            let image = props.phase === phaseNumber
            ? phases[key].current
            : (
              props.phase < phaseNumber
              ? phases[key].future
              : phases[key].past
            )
            return (
              <StepImage
                phase={props.phase}
                image={image}
              />
            )}
          )}
        </div>
      </div>
    </section>
  );
}

export default ProgressBar;
