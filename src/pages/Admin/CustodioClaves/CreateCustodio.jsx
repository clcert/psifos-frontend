import FooterParticipa from "../../../component/Footers/FooterParticipa";
import ImageFooter from "../../../component/Footers/ImageFooter";
import Title from "../../../component/OthersComponents/Title";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import SubNavbar from "../component/SubNavbar";
import { Button } from "react-bulma-components";
import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import { backendIP } from "../../../server";
import { useNavigate } from "react-router-dom";

function CreateCustodio() {
  /**
   * View for create a new custodio
   */

  const [name, setName] = useState("");
  const [login_id, setLoginId] = useState("");
  const [email, setEmail] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  /** @urlParams uuid of election */
  const { uuid } = useParams();

  async function createCustodio() {
    /**
     * Create a new custodio
     */
    const token = sessionStorage.getItem("token");
    const url = backendIP + "/" + uuid + "/create-trustee";
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "x-access-tokens": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        trustee_login_id: login_id,
        email: email,
      }),
    });
    const data = await resp.json();
    if (resp.status === 200) {
      navigate("/admin/" + uuid + "/custodio", {
        state: {
          message: "Custodio creado con exito!",
        },
      });
    } else {
      showMessage(true);
      setMessage("Ocurrio un error al crear el custodio, intente nuevamente");
    }
  }

  function verifyForm() {
    /**
     * Verify if form is valid
     */
    if (name === "" || email === "") {
      setShowMessage(true);
      setMessage("Todos los campos son obligatorios");
    } else {
      createCustodio();
    }
  }

  const onKeyDownHandler = (e) => {
    if (e.keyCode === 13) {
      verifyForm();
    }
  };

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Custodio de Claves" nameElection={"nameElection"} />
        </div>
      </section>

      <SubNavbar active={4} />

      <section
        className="section columns is-flex is-vcentered is-centered mb-0 mt-3"
        id="not-allowed-section"
      >
        <div onKeyDown={onKeyDownHandler} className="form-election">
          {showMessage && (
            <div class="notification is-danger is-light">{message}</div>
          )}
          <div className="field">
            <label className="label label-form-election">Nombre</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Nombre"
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="field">
            <label className="label label-form-election">Login ID</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Login ID"
                onChange={(e) => {
                  setLoginId(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="field">
            <label className="label label-form-election">Correo</label>
            <div className="control">
              <input
                className="input"
                type="text"
                placeholder="Correo"
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="level">
            <Button className="button-custom mr-2 ml-2 level-left">
              <Link className="link-button" to={"/admin/" + uuid + "/custodio"}>
                Atras
              </Link>
            </Button>

            <Button
              onClick={verifyForm}
              className="button-custom mr-2 ml-2 level-right"
            >
              Crear custodio
            </Button>
          </div>
        </div>
      </section>

      <div>
        <ImageFooter imagePath={"imageTrustees"} />
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
      </div>
    </div>
  );
}

export default CreateCustodio;
