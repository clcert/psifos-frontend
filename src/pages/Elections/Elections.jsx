import { useInViewport } from "react-in-viewport";
import React, { useRef } from "react";
import UpperBanner from "../../component/Banner/UpperBanner";
import sobre from "../../static/new_home_assets/SVG/sobre.svg";

function Elections () {

  const elections = require("../../static/data/elections.json");

  const myRef = useRef();
  const [showAnimation, setShowAnimation] = React.useState(false);
  const { inViewport } = useInViewport(myRef);
  if (inViewport && !showAnimation) {
    setShowAnimation(true);
  }

  return (
    <div id="realizada">
      <UpperBanner subtitle="LISTADO DE VOTACIONES Y CONSULTAS" />
      <section className="section past-section" ref={myRef}>
        <div
          className={
            "container " +
            (showAnimation ? "slide-left-activate" : "slide-left-enter")
          }
         
        >
          <div className="past-elections-box  pb-2">
            <div className="is-flex mt-2">
              <img width={40} height={40} src={sobre} alt=""/>
              <p className="election-info mb-2 mx-2">
                <span className="has-text-weight-bold current-election-title">
                  ELECCIONES REALIZADAS
                </span>
              </p>
            </div>
            <div className="content-past-elections pl-5">
              {
                elections.data.map((election, index) =>
                  <div className="past-election" key={index}>
                    <span className="date-container">
                    { 
                      new Date(`${election.date} 00:00`).toLocaleDateString("es-ES", { 
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric' 
                      })
                    }
                    </span>
                    <span className={"bullet-" + String((index % 2) + 1)}>
                      { " ● " }
                    </span>
                    { election.unit }
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Elections