import React from "react";
import UpperBanner from "../../component/Banner/UpperBanner";
import Posts from "./components/Posts";

function News () {
  return (
    <div id="content">
      <UpperBanner subtitle="NOTICIAS Y PRENSA"/>
      <section className="section notice-section" id="noticias">
        <div className="color-notice">
          <div className="container">
            <h1 className="title pt-4" id="election-current">
              NOTICIAS
            </h1>
            <div className="container steps-container">
              <div className="columns is-variable">
                <Posts fromFile='news.json' />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default News