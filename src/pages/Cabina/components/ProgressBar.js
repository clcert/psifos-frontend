import fase1 from "../../../static/cabina/svg/menu1-1.svg";
import fase2 from "../../../static/cabina/svg/menu2-1.svg";
import fase3 from "../../../static/cabina/svg/menu3-1.svg";
import fase1On from "../../../static/cabina/svg/menu1-2.svg";
import fase2On from "../../../static/cabina/svg/menu2-2.svg";
import fase3On from "../../../static/cabina/svg/menu3-2.svg";

function ProgressBar(props) {
  return (
    <section className="section px-0" id="progress-bar">
      <div className="line-1 is-hidden-touch" id="progress-line"></div>
      <div className="container has-text-centered progress-container">
        <div className="columns progress-bar-items is-variable">
          <div className="column">
            <figure className="image is-3by1">
              <img id="progress-1" src={props.phase === 1 ? fase1On : fase1} alt=""/>
            </figure>
          </div>
          <div className="column">
            <figure className="image is-3by1">
              <img id="progress-2" src={props.phase === 2 ? fase2On : fase2} alt=""/>
            </figure>
          </div>
          <div className="column">
            <figure className="image is-3by1">
              <img id="progress-3" src={props.phase === 3 ? fase3On : fase3} alt=""/>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}

export default ProgressBar;
