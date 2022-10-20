import logoConEscudo from "../../static/new_home_assets/SVG/logo-con-escudo.svg";
import $ from "jquery";
function NavbarLogo(props) {
  return (
    <div className="navbar-brand pt-0">
      <div id="logo-header">
        <a href="https://participa.uchile.cl/" rel="noreferrer" target="_blank">
          <img
            className="mt-2 px-3"
            src={logoConEscudo}
            alt="Logo Participa UChile"
            width="300"
          />
        </a>
      </div>

      <a
        href={() => false}
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
  );
}

export default NavbarLogo;
