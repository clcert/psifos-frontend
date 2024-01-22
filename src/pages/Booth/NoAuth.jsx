import ElectionCode from "../../component/Footers/ElectionCode";
import TitlePsifos from "../../component/OthersComponents/TitlePsifos";
import { InfoChannels } from "../../component/ShortNavBar/ModalHelp";
import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import { Link } from "react-router-dom";

function NoAuth({ addressLogout, title, message }) {
  return (
    <div id="content" className="parallax-01">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar linkExit={addressLogout} linkInit="" />
          <TitlePsifos namePage={title} />
        </div>
      </section>

      <section className="section pb-0" id="auth-section">
        <div className="has-text-centered title is-size-4-mobile">
          {message}
        </div>
        <hr />
        <div className="has-text-centered is-size-4-mobile mb-2">
          <h3 className="modal-title">MESA DE AYUDA</h3>

          <p className="mb-2 ml-2 mr-2">
            <span className="has-text-weight-bold">
              ¿Tiene dudas o problemas con su elección?
            </span>
            <br />
            Puede utilizar cualquiera de los siguientes canales para
            contactarnos:
          </p>
          <InfoChannels />
        </div>

        <div className="d-flex justify-content-center pb-3">
          <button className="btn-fixed button review-buttons previous-button has-text-white has-text-weight-bold">
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              <span>Ir al inicio</span>
            </Link>
          </button>
          <button
            onClick={() => {
              window.location.href = addressLogout;
            }}
            className="btn-fixed button review-buttons previous-button has-text-white has-text-weight-bold ml-3"
          >
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </section>
      <ElectionCode />
      <div id="bottom"></div>
    </div>
  );
}

export default NoAuth;
