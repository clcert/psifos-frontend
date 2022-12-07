import logo from "../../static/new_home_assets/SVG/logo participa.svg";
import { useState } from "react";

function NavHome(props) {
  const [showNavbarBurger, setShowNavbarBurger] = useState(false);
  const [showNavbarMenu, setShowNavbarMenu] = useState(false);
  return (
    <div className="columns is-flex is-vcentered">
      <nav className="navbar" role="navigation" aria-label="main navigation">
        <div className="navbar-brand">
          <a
            className="navbar-item image-navbar-burger"
            href="https://participa.uchile.cl"
          >
            <img
              src={logo}
              id="image-navbar"
              alt="Logo participa UCHILE"
              width={500}
              height={500}
            />
          </a>

          <a
            href={() => false}
            role="button"
            className={"navbar-burger " + (showNavbarBurger ? "is-active" : "")}
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            onClick={() => {
              setShowNavbarBurger(!showNavbarBurger);
              setShowNavbarMenu(!showNavbarMenu);
            }}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div
          id="navbarBasicExample"
          className={"navbar-menu " + (showNavbarMenu ? "is-active" : "")}
          style={{ position: "relative" }}
        >
          <div className="navbar-start">
            <a className="navbar-item" href="#curso" id="navbar-button-home">
              EN CURSO
            </a>
            <a
              className="navbar-item"
              href="#realizada"
              id="navbar-button-home"
            >
              REALIZADAS
            </a>
            <a className="navbar-item" href="#video" id="navbar-button-home">
              MATERIAL EXPLICATIVO
            </a>
            <a className="navbar-item" href="/#" id="navbar-button-home">
              CABINA DE VOTACIÓN
            </a>
            <a className="navbar-item" href="#faq" id="navbar-button-home">
              FAQ
            </a>
            <a className="navbar-item" href="#prensa" id="navbar-button-home">
              PRENSA
            </a>
            <a className="navbar-item" href="#noticias" id="navbar-button-home">
              NOTICIAS
            </a>
            <a className="navbar-item" href="/#" id="navbar-button-home">
              SOFTWARE
            </a>
            <a className="navbar-item" href="#equipo" id="navbar-button-home">
              EQUIPO
            </a>
            <div className="mt-2">
              <span className="icon ml-2 mr-4">
                <i className="icon-twitter"></i>
              </span>
              <span className="icon">
                <i className="icon-mail"></i>
              </span>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavHome;
