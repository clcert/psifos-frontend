import logoParticipa from "../../static/new_home_assets/SVG/logo participa.svg";
import logoUchile from "../../static/new_home_assets/SVG/logo uchile.svg";
import $ from "jquery";
function NavbarLogo(props) {
  return (
    <div className="navbar-brand pt-0">
      <a className="navbar-item pt-0" href="https://participa.uchile.cl/">
        <div id="logo-header">
          <img className="p-2" id="logo-image-2" src={logoUchile} width="300" alt="Logo Uchile"/>
          <div id="logo-barra-menu" className="pl-2 pr-0"></div>
          <img
            className="p-2"
            id="logo-image-1"
            src={logoParticipa}
            width="300"
            alt="Logo Participa"
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
  );
}

export default NavbarLogo;
