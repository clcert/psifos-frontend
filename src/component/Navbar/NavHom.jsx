import { useState } from "react";
import { HashLink } from 'react-router-hash-link';
import logo from "../../static/new_home_assets/SVG/logo participa.svg";

function NavHome() {
  const [showNavbarBurger, setShowNavbarBurger] = useState(false);
  const [showNavbarMenu, setShowNavbarMenu] = useState(false);

  const sections = [
    { name: "EN CURSO", href: { pathname: "/", hash: "#curso" } },
    { name: "COMO VOTAR", href: { pathname: "/", hash: "#video" } },
    { name: "FAQ", href: { pathname: "/", hash: "#faq" } },
    { name: "EQUIPO", href: { pathname: "/", hash: "#equipo" } },
    { name: "ELECCIONES", href: { pathname: "/elecciones" } },
    { name: "NOTICIAS", href: { pathname: "/noticias" } },
  ]
  return (
    <div className="is-flex is-justify-content-right">
      <nav className="transparent-bg navbar" role="navigation" aria-label="main navigation">
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
            {sections.map((section, index) => (
              <HashLink className="navbar-item" to={section.href} id="navbar-button-home" key={index}>
                {section.name}
              </HashLink>
            ))}
            <div className="mt-2 nav-icons">
              <div className="icon ml-2 mr-4">
                <i className="icon-twitter"></i>
              </div>
              <div className="icon">
                <i className="icon-mail"></i>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavHome;
