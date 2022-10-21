import $ from "jquery";
import { useInViewport } from "react-in-viewport";
import React, { useRef } from "react";

function Notice(props) {
  const myRef = useRef();
  const [showAnimation, setShowAnimation] = React.useState(false);
  const { inViewport } = useInViewport(myRef);
  if (inViewport && !showAnimation) {
    setShowAnimation(true);
  }
  return (
    <>
      <div
        className={
          "card " + (showAnimation ? "opacity-activate" : "opacity-enter")
        }
        ref={myRef}
      >
        <div className="card-content">
          <div className="title-notice-box pt-1 pb-2">
            <p>{props.date}</p>
            <p>{props.title}</p>
          </div>
          <img
            width={1000}
            height={100}
            src={process.env.PUBLIC_URL + props.image}
            alt=""
          ></img>

          <div className="p-5 text-notice-box">
            <p>{props.shortInfo}</p>
            <div className="pt-4 more-notice-box">
              <a
                href={() => false}
                onClick={() => {
                  $("#info-notice" + String(props.index)).addClass("is-active");
                }}
              >
                {" "}
                LEER MÁS
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default Notice;
