import React from "react";
import UpperBanner from "../../component/Banner/UpperBanner";
import Posts from "./components/Posts";
import FooterParticipa from "../../component/Footers/FooterParticipa";

function News () {
  return (
    <div id="content">
      <UpperBanner title="NOTICIAS Y PRENSA"/>
      <section className="section notice-section" id="noticias">
        <div className="color-notice">
          <div className="container pt-5">
            <div className="container steps-container">
              <div className="columns is-variable">
                <Posts fromFile='news.json' />
              </div>
            </div>
          </div>
        </div>
      </section>
      <FooterParticipa message="SEGURIDAD ∙ TRANSPARENCIA ∙ VERIFICACIÓN" />
      <section className="hero">
        <div className="hero-body bottom-hero py-4"></div>
      </section>
    </div>
  )
}

export default News