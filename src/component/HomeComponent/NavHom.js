function NavHome(props) {
  return (
    <div className="container">
      <nav
        className="navbar custom-navbar mr-6"
        role="navigation"
        aria-label="main navigation"
      >
        <div className="navbar-brand is-justify-content-center is-align-items-center">
          <a
            className="navbar-item is-hidden-desktop pr-0 pl-2 mr-4 has-text-centered"
            href="https://participa.uchile.cl"
          >
            <img src={props.logo} width="300" />
          </a>

          <a
            role="button"
            className="navbar-burger"
            aria-label="menu"
            aria-expanded="false"
            data-target="navbarBasicExample"
            style={{"textDecoration": "none"}}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </a>
        </div>

        <div id="navbarBasicExample" className="navbar-menu ml-6">
          <div className="navbar-end">
            <a
              className="navbar-button navbar-item"
              id="navbar-button-1"
              href="#eleccion"
              style={{"textDecoration": "none"}}
            >
              {" "}
              En Curso{" "}
            </a>

            <a
              className="navbar-button navbar-item"
              id="navbar-button-2"
              href="#realizadas"
              style={{"textDecoration": "none"}}
            >
              {" "}
              Realizadas{" "}
            </a>

            <a
              className="navbar-button navbar-item"
              id="navbar-button-3"
              href="#video"
              style={{"textDecoration": "none"}}
            >
              {" "}
              ¿Cómo votar?{" "}
            </a>

            <a
              className="navbar-button navbar-item"
              id="navbar-button-4"
              href="#faq"
              style={{"textDecoration": "none"}}
            >
              {" "}
              FAQ{" "}
            </a>

            <a
              className="navbar-button navbar-item"
              id="navbar-button-1"
              href="#equipo"
              style={{"textDecoration": "none"}}
            >
              {" "}
              Equipo{" "}
            </a>

            <a
              className="navbar-item"
              target="_blank"
              href="https://www.twitter.com/participaUChile"
              style={{"textDecoration": "none"}}
            >
              <span className="icon">
                <i className="fab fa-twitter"></i>
              </span>
            </a>

            <a
              className="navbar-item"
              target="_blank"
              href="mailto:participa@uchile.cl"
              style={{"textDecoration": "none"}}
            >
              <span className="icon">
                <i className="far fa-envelope"></i>
              </span>
            </a>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default NavHome;
