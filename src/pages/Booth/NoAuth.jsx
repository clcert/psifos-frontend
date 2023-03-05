import ElectionCode from "../../component/Footers/ElectionCode";
import TitlePsifos from "../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import { Link, useParams } from "react-router-dom";

function NoAuth(props) {
  const { uuid } = useParams();

  return (
    <div id="content">
      <section className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar linkExit={props.adressLogout} linkInit="" />
          <TitlePsifos namePage={props.title} />
        </div>
      </section>

      <section className="section pb-0" id="auth-section">
        <div className="has-text-centered title is-size-4-mobile">
          {props.message}
        </div>

        <div className="d-flex justify-content-center pb-3">
          <button className="btn-fixed button review-buttons previous-button has-text-white has-text-weight-bold">
            <Link style={{ textDecoration: "none", color: "white" }} to="/">
              <span>Ir al inicio</span>
            </Link>
          </button>
          <button
            onClick={() => {
              window.location.href = props.adressLogout;
            }}
            className="btn-fixed button review-buttons previous-button has-text-white has-text-weight-bold ml-3"
          >
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </section>
      <ElectionCode uuid={uuid} />
      <div id="bottom"></div>
    </div>
  );
}

export default NoAuth;
