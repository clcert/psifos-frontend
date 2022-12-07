import logo from "../../static/new_home_assets/SVG/logo participa.svg";
import { useState } from "react";

function NavHome() {
  const [showNavbarBurger, setShowNavbarBurger] = useState(false);
  const [showNavbarMenu, setShowNavbarMenu] = useState(false);

  const sections = [
    { name: "EN CURSO", href: "#curso" },
    { name: "ELECCIONES", href: "#realizada" },
    { name: "COMO VOTAR", href: "#video" },
    { name: "FAQ", href: "#faq" },
    { name: "NOTICIAS", href: "#noticias" },
    { name: "EQUIPO", href: "#equipo" },
  ]
  return (
    <div className="is-flex is-justify-content-center">
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
              <a className="navbar-item" href={section.href} id="navbar-button-home" key={index}>
                {section.name}
              </a>
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
