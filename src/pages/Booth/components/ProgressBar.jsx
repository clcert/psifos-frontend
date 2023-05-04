import fase1 from "../../../static/booth/svg/menu1-1.svg";
import fase2 from "../../../static/booth/svg/menu2-1.svg";
import fase3 from "../../../static/booth/svg/menu3-1.svg";
import fase1On from "../../../static/booth/svg/menu1-2.svg";
import fase2On from "../../../static/booth/svg/menu2-2.svg";
import fase3On from "../../../static/booth/svg/menu3-2.svg";
import React from "react";

function ProgressBar(props) {
  const Image = React.memo(function Image({ src }) {
    return <img src={src} className="spinner" alt="" />;
  });
  return (
    <section className="section px-0" id="progress-bar">
      <div className="line-1 is-hidden-touch" id="progress-line"></div>
      <div className="container has-text-centered progress-container">
        <div className="columns progress-bar-items">
          <div
            className={
              "column " + (props.phase !== 1 ? "column hide-mobile" : "")
            }
          >
            <img src={props.phase === 1 ? fase1On : fase1} className="spinner" alt="" style={{ maxWidth: "85%" }} />
          </div>
          <div
            className={
              "column " + (props.phase !== 2 ? "column hide-mobile" : "")
            }
          >
            <img src={props.phase === 2 ? fase2On : fase2} className="spinner" alt="" style={{ maxWidth: "85%" }} />
          </div>
          <div
            className={
              "column " + (props.phase !== 3 ? "column hide-mobile" : "")
            }
          >
            <img src={props.phase === 3 ? fase3On : fase3} className="spinner" alt="" style={{ maxWidth: "85%" }} />
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressBar;
