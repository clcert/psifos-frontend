import logoConEscudo from "../../static/new_home_assets/SVG/uparticipa-logo-usach.png";
import $ from "jquery";
function NavbarLogo(props) {
  return (
    <div className="navbar-brand pt-0 navbar-brand-width">
      <div id="logo-header" className="is-align-items-center">
        <a href="https://participa.uchile.cl/" rel="noreferrer" target="_blank">
          <img
            className="mt-0 px-3"
            src={logoConEscudo}
            alt="Logo Participa UChile"
            width="300"
          />
        </a>
      </div>

      <a
        href="#"
        role="button"
        className="navbar-burger is-align-self-center"
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
