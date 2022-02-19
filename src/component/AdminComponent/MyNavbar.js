import { useState } from "react";
import logoParticipa from "../../static/new_home_assets/SVG/logo participa.svg";
import logoUchile from "../../static/new_home_assets/SVG/logo uchile.svg";
import ModalInfo from "./ModalInfo";
import ModalHelp from "./ModalHelp";
import $ from "jquery";

function MyNavbar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  return (
    <div className="container">
      <div className="container disable-text-selection">
        <nav
          className="navbar is-spaced pt-0"
          id="navbar"
          role="navigation"
          aria-label="main navigation"
        >
          <div className="navbar-brand pt-0">
            <a className="navbar-item pt-0" href="https://participa.uchile.cl/">
              <div id="logo-header">
                <img
                  className="p-2"
                  id="logo-image-1"
                  src={logoParticipa}
                  width="300"
                />
                <div id="logo-barra-menu" className="pl-2 pr-0"></div>
                <img
                  className="p-2"
                  id="logo-image-2"
                  src={logoUchile}
                  width="300"
                />
              </div>
            </a>

            <a
              role="button"
              className="navbar-burger"
              aria-label="menu"
              aria-expanded="false"
              data-target="navbarBasicExample"
              onClick={() => {
                $(".navbar-burger").toggleClass("is-active");
                $(".navbar-menu").toggleClass("is-active");
              }}
            >
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
              <span aria-hidden="true"></span>
            </a>
          </div>

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item buttons-container pt-0">
                <div id="navbar-buttons">
                  <a
                    href={
                      isAdmin
                        ? "https://participa.uchile.cl/"
                        : "https://participa.uchile.cl/"
                    }
                    style={{textAlign: "left"}}
                    className="menu-text-admin"
                    id="text-button"
                  >
                    INICIO
                  </a>
                  <a
                    onClick={() => {
                      $("#info-modal").addClass("is-active");
                    }}
                    className="menu-text-admin"
                    id="text-button"
                  >
                    INFO
                  </a>
                  <a
                    onClick={() => {
                      $("#help-modal").addClass("is-active");
                    }}
                    className="menu-text-admin"
                    id="text-button"
                  >
                    AYUDA
                  </a>
                  <a
                    href="https://participa.uchile.cl/"
                    className="menu-text-admin"
                    id="text-button"
                  >
                    SALIR
                  </a>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </div>
      <ModalInfo show={showInfo} onHide={() => setShowInfo(false)} />
      <ModalHelp show={showHelp} onHide={() => setShowHelp(false)} />
    </div>
  );
}

export default MyNavbar;
