import React from 'react';

import NavHome from "../Navbar/NavHom";
import ScrollButton from "./ScrollButton";

import mono from "../../static/new_home_assets/SVG/monito.svg";
import logoParticipa from "../../static/new_home_assets/SVG/logo participa.svg";
import logoUchile from "../../static/new_home_assets/SVG/logo uchile.svg";

function UpperBanner ({title= '', subtitle= ''}) {
  return (
    <>
      <div className="navbar-div pb-3">
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
              { title !== '' &&
                <>
                  <span className="big-text-title">{ title }</span>
                  <br />
                </>
              }
              { subtitle !== '' && subtitle }
            </p>
          </div>
          <div className="column is-align-self-center is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
            <figure className="image mb-0" style={{ width: "300px" }}>
              <img src={logoParticipa} alt="Logo participa" />
            </figure>
            <div className="barra-menu mx-2" style={{ height: "50px" }}></div>
            <figure className="image mb-0" style={{ width: "40px" }}>
              <img src={logoUchile} alt="Logo Uchile" />
            </figure>
          </div>
          {/* <div className="barra-menu"></div>
          <div className="column is-align-self-center">
            <figure className="image" style={{ width: "70px" }}>
              <img src={logoUchile} alt="Logo Uchile" />
            </figure>
          </div> */}
        </div>
      </section>
    </>
  )
}

export default UpperBanner