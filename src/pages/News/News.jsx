import React from "react";
import Posts from "../Home/components/Posts";
import NavHome from "../../component/Navbar/NavHom";
import ScrollButton from "../Home/components/ScrollButton";

import mono from "../../static/new_home_assets/SVG/monito.svg";
import logoParticipa from "../../static/new_home_assets/SVG/logo participa.svg";
import logoUchile from "../../static/new_home_assets/SVG/logo uchile.svg";

function News () {
  return (
    <div id="content">
      <div className="navbar-div">
        <div className="container">
          <NavHome logo={logoParticipa} />
        </div>
      </div>
      <ScrollButton></ScrollButton>
      <section className="section top-section pt-3 is-hidden-touch">
        <div className="columns container " style={{ height: "157px" }}>
          <div className="column is-align-self-center  pl-6">
            <figure
              className="image"
              style={{ width: "316px", height: "374px" }}
            >
              <img src={mono} alt="" />
            </figure>
          </div>
          <div className="column is-align-self-center">
            <p className="has-text-weight-bold text-title">
              NOTICIAS Y PRENSA
            </p>
          </div>
          <div className="column is-align-self-center">
            <figure className="image" style={{ width: "400px" }}>
              <img src={logoParticipa} alt="Logo participa" />
            </figure>
          </div>
          <div className="barra-menu"></div>
          <div className="column is-align-self-center">
            <figure className="image" style={{ width: "70px" }}>
              <img src={logoUchile} alt="Logo Uchile" />
            </figure>
          </div>
        </div>
      </section>{" "}
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