import { useState } from "react";
import logo from "../../logo.svg";
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
          <div className="navbar-brand">
            <a
              className="navbar-item pt-0"
              href="https://participa.uchile.cl/"
            >
              <img className="p-2" id="logo-header" src={logo} width="300" />
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

          <div
            id="navbarBasicExample"
            className="navbar-menu"
          >
            <div className="navbar-end">
              <div className="navbar-item buttons-container pt-0">
                <div id="navbar-buttons">
                  <button className="navbar-button" id="navbar-button-1-admin">
                    <a
                      href={
                        isAdmin
                          ? "https://participa.uchile.cl/"
                          : "https://participa.uchile.cl/"
                      }
                      className="menu-text"
                      id="inicio"
                    >
                      INICIO
                    </a>
                  </button>
                  <button
                    className="navbar-button"
                    id="navbar-button-2-admin"
                    onClick={() => {$('#info-modal').addClass('is-active')}}
                  >
                    <span className="menu-text" id="info">
                      INFO
                    </span>
                  </button>
                  <button
                    className="navbar-button"
                    id="navbar-button-3-admin"
                    onClick={() => {$('#help-modal').addClass('is-active');}}
                  >
                    <span className="menu-text" id="ayuda">
                      AYUDA
                    </span>
                  </button>
                  <button className="navbar-button" id="navbar-button-4-admin">
                    <a
                      href="https://participa.uchile.cl/"
                      className="menu-text"
                      id="salir"
                    >
                      SALIR
                    </a>
                  </button>
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
