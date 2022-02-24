import $ from "jquery";
import ModalInfo from "./ModalInfo";
import NavbarLogo from "./NavbarLogo";
import UserButton from "./UserButton";
import { useState } from "react";
import ModalHelp from "./ModalHelp";

function NavbarAdmin(props) {
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
          <NavbarLogo />

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
                    style={{ textAlign: "left" }}
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
                    HELIOS
                  </a>

                  <UserButton />
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
export default NavbarAdmin;
