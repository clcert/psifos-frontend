import $ from "jquery";
import { useInViewport } from "react-in-viewport";
import React, { useRef } from "react";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

function NewsPost({post, index}) {
  const myRef = useRef();
  const [showAnimation, setShowAnimation] = React.useState(false);
  const { inViewport } = useInViewport(myRef);
  if (inViewport && !showAnimation) {
    setShowAnimation(true);
  }
  const postDateStr = new Date(`${post.date} 00:00`).toLocaleDateString("es-ES", { 
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric' 
  });

  return (
    <>
      <div
        className={
          "notice-card " + (showAnimation ? "opacity-activate" : "opacity-enter")
        }
        ref={myRef}
      >
        <div>
          <div>
            <p className="notice-date">{postDateStr}</p>
            <p className="notice-title">{post.title}</p>
          </div>
          <img
            width={1000}
            height={100}
            src={process.env.PUBLIC_URL + post.img}
            alt=""
          ></img>

          <div className="p-4 text-notice-box has-text-justified">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.summary}</ReactMarkdown>
            <div className="pt-4 more-notice-box">
              <a
                href={() => false}
                onClick={() => {
                  $("#info-notice" + String(index)).addClass("is-active");
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
export default NewsPost;
