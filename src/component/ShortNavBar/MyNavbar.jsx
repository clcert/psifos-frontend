import { useState } from "react";

import ModalInfo from "./ModalInfo";
import ModalHelp from "./ModalHelp";
import NavbarLogo from "./NavbarLogo";
import { Link } from "react-router-dom";

function MyNavbar(props) {
  /** @state {bool} state for info modal */
  const [showInfo, setShowInfo] = useState(false);

  /** @state {bool} state for help modal */
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
          <NavbarLogo />

          <div id="navbarBasicExample" className="navbar-menu">
            <div className="navbar-end">
              <div className="navbar-item buttons-container pt-0">
                <div id="navbar-buttons">
                  <Link
                    to={props.linkInit}
                    style={{ textAlign: "left" }}
                    className="menu-text-admin"
                    id="text-button"
                  >
                    INICIO
                  </Link>

                  <a
                    onClick={() => {
                      setShowInfo(true);
                    }}
                    className="menu-text-admin"
                    id="text-button"
                  >
                    INFO
                  </a>
                  <a
                    onClick={() => {
                      setShowHelp(true);
                    }}
                    className="menu-text-admin"
                    id="text-button"
                  >
                    AYUDA
                  </a>
                  <a
                    href={props.linkExit}
                    className="menu-text-admin mr-0"
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
