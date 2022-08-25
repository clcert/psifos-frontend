import logoParticipa from "../../../static/new_home_assets/SVG/logo participa.svg";
import { useState } from "react";
import { Buffer } from "buffer";
import { backendIP } from "../../../server";

function Login() {
  /**
   * View for admin login
   */

  /** @state {string} username admin */
  const [username, setUsername] = useState("");

  /** @state {string} password admin */
  const [password, setPassword] = useState("");

  /** @state {boolean} message for login feedback */
  const [alertMessage, setAlertMessage] = useState("");

  /** @state {boolean} color alert */
  const [colorAlert, setColorAlert] = useState("");

  function setToken(userToken) {
    /**
     * set token in localStorage
     * @param {string} userToken info with token
     */

    sessionStorage.setItem("token", userToken["token"]);
    window.location.href = "/admin/home";
  }

  function setUser(user) {
    /**
     * set user in localStorage
     * @param {string} user info with user
     */
    sessionStorage.setItem("user", user);
  }

  async function login() {
    /**
     * async function for login admin
     */

    let url = backendIP + "/login";
    let encoded = Buffer.from(username + ":" + password);
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: "Basic " + encoded.toString("base64"),
        "Content-Type": "application/json",
      },
    });

    if (resp.status === 201) {
      const data = await resp.json();
      setColorAlert("green");
      setAlertMessage("Inicio exitoso!");
      setUser(username);
      setToken(data);
    } else if (resp.status === 401) {
      const data = await resp.json();
      setColorAlert("red");
      setAlertMessage(data["message"]);
    }
  }

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      login();
    }
  };

  return (
    <div onKeyDown={onKeyDownHandler} id="content-login">
      <section className="columns is-flex is-vcentered is-centered login-section parallax hero is-medium">
        <div className="container-login">
          <div className="container-content-login">
            <img src={logoParticipa} alt="Logo Participa" />
            <div className="container-login-title">PANEL ADMINISTRADOR</div>
            <div
              style={{ color: colorAlert }}
              className="container-login-subtitle"
            >
              {alertMessage}
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
                    onChange={(e) => setUsername(e.target.value)}
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
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>{" "}
                {/* .control */}
              </div>{" "}
              {/* .field */}
              <div className="footer-login level is-flex pt-2 ">
                <div className="footer-register-login level-left mr-3 pl-5 pr-5">
                  {/* <div>
                    <p className="footer-register-text pt-0">
                      Registrate <a className="footer-register-link">AQUÍ</a>
                    </p>
                  </div> */}
                </div>
                <div className="field leve-right ml-5">
                  <div className="control">
                    <button
                      onClick={login}
                      className="button is-primary footer-register-button"
                    >
                      ACCEDE
                    </button>
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
