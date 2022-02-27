import { Link } from "react-router-dom";
import logoParticipa from "../../../static/new_home_assets/SVG/logo participa.svg";

function Login(props) {
  return (
    <div id="content-login">
      <section className="columns is-flex is-vcentered is-centered login-section parallax hero is-medium">
        <div className="container-login">
          <div className="container-content-login">
            <img src={logoParticipa} alt="Logo Participa"/>
            <div className="container-login-title">VOTACIÓN PRIVADA</div>
            <div className="container-login-subtitle">
              Para continuar ingrese los datos enviados por correo
            </div>
            <div className="container-login-form">
              <div className="field">
                <label className="label">Usuario</label>
                <div className="control">
                  <input
                    className="input field-login"
                    id="user-login"
                    type="text"
                    placeholder="Usuario"
                  />
                </div>{" "}
                {/* .control */}
              </div>{" "}
              {/* .field */}
              <div className="field">
                <label className="label">Correo</label>
                <div className="control">
                  <input
                    className="field-login input"
                    id="correo-login"
                    type="text"
                    placeholder="Correo"
                  />
                </div>{" "}
                {/* .control */}
              </div>{" "}
              {/* .field */}
              <div className="field">
                <label className="label">Clave</label>
                <div className="control">
                  <input
                    className="input field-login"
                    id="clave-login"
                    type="password"
                    placeholder="Clave"
                  />
                </div>{" "}
                {/* .control */}
              </div>{" "}
              {/* .field */}
              <div className="footer-login is-flex pt-2 ">
                <div className="footer-register-login mr-3 pl-5 pr-5">
                  <p className="footer-register-text mb-0">
                    si aun no tienes cuenta
                  </p>
                  <p className="footer-register-text pt-0">
                    Registrate <a className="footer-register-link">AQUÍ</a>
                  </p>
                </div>
                <div className="field ml-5">
                  <div className="control">
                    <button className="button is-primary footer-register-button"><Link style={{textDecoration: "None", color: "white"}} to="/admin/home">ACCEDE</Link></button>
                  </div>{" "}
                  {/* .control */}
                </div>{" "}
                {/* .field */}
              </div>
            </div>{" "}
            {/* .container-login-form */}
          </div>{" "}
        </div>
        {/* .container-login */}
      </section>
    </div>
  );
}

export default Login;
