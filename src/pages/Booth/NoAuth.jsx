import ElectionCode from "../../component/Footers/ElectionCode";
import TitlePsifos from "../../component/OthersComponents/TitlePsifos";
import MyNavbar from "../../component/ShortNavBar/MyNavbar";
import { Link } from "react-router-dom";
import { useEffect } from "react";

function NoAuth({ addressLogout, title, message }) {
  useEffect(() => {
    (function(w, d, s, u) {
      w.RocketChat = function(c) { w.RocketChat._.push(c) }; w.RocketChat._ = []; w.RocketChat.url = u;
      var h = d.getElementsByTagName(s)[0], j = d.createElement(s);
      j.async = true; j.src = 'https://chat.labs.clcert.cl/livechat/rocketchat-livechat.min.js?_=201903270000';
      h.parentNode.insertBefore(j, h);
    })(window, document, 'script', 'https://chat.labs.clcert.cl/livechat');
  }, [])

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
            Puede contactarse con la mesa de ayuda haciendo click en el ícono <span className="icon is-medium has-background-info has-text-white"><i className="fa-brands fa-rocketchat"></i></span> que se encuentra en la parte inferior de este sitio.
          </p>
          {/* <InfoChannels /> */}
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
