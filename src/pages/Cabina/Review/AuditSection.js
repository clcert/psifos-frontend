import $ from "jquery";
import { useState } from "react";
import auditImage from "../../../static/cabina/svg/audit-img.svg";

function AuditSection(props) {
  const [pane1, setPane1] = useState(true);
  const [pane2, setPane2] = useState(false);

  const changePane = () => {
    setPane1(!pane1);
    setPane2(!pane2);
  };
  return (
    <section className="section pb-0" id="audit-section">
      <div className="container has-text-centered is-max-desktop">
        <h1 className="title has-text-black is-spaced">AUDITA TU VOTO</h1>

        <p className="pb-3">
          Este voto ha sido auditado, por lo que no será contabilizado. En la
          pestaña "VOTO AUDITADO" está la información de tu voto auditado, y en
          la pestaña "IMPORTANTE" podrás encontrar los pasos a seguir con tu
          voto auditado.
        </p>

        <div className="tabs is-large is-boxed mb-0">
          <ul style={{ marginBottom: "0" }}>
            <li className="is-active" id="audit-vote-wrapper">
              <a
                id="audit-vote-tab"
                onClick={() => {
                  changePane();
                }}
              >
                VOTO AUDITADO
              </a>
            </li>
            <li className="is-active" id="important-wrapper">
              <a
                id="important-tab"
                onClick={() => {
                  changePane();
                }}
              >
                IMPORTANTE
              </a>
            </li>
          </ul>
        </div>

        <div
          id="pane-1"
          className={"box udait-trail-box " + (pane1 ? "" : "is-hidden")}
        >
          <div className="container pb-3 has-text-centered">
            <button
              id="button-copy-audited"
              className="button is-rounded button-copy-audited"
              onclick="BOOTH.copyToClipboard('#code-audited');"
            >
              <span>COPIAR VOTO AUDITADO</span>
              <span className="icon">
                <i className="far fa-copy is-white"></i>
              </span>
            </button>
          </div>
          <code id="code-audited"></code>
        </div>
        <div
          id="pane-2"
          className={"box important-box " + (pane2 ? "" : "is-hidden")}
        >
          <div className="content">
            <p>
              Puedes verificar que tu voto auditado contiene la(s) opción(es)
              que tu seleccionaste utilizando uno de los siguientes
              verificadores disponibles:
              <ol>
                <li>
                  <a
                    target="_blank"
                    href="single-ballot-verify.html?election_url={$T.election_url}"
                  >
                    Verificador Participa UChile
                  </a>
                </li>
              </ol>
            </p>
            <p>
              También puedes{" "}
              <a onclick="BOOTH.post_audited_ballot();">
                publicar tu voto auditado
              </a>{" "}
              para que otras personas puedan confirmar que este voto fue
              correctamente calculado.
            </p>
          </div>
        </div>

        <p>
          Para volver a la votación puedes apretar "VOLVER A VOTAR" donde tus
          selecciones serán encriptadas nuevamente y podrás seguir con el
          proceso.
        </p>

        <div className="container has-text-centered mt-6">
          <div className="columns pb-0">
            <div className="column">
              <button
                className="button is-medium"
                id="back-to-vote"
                onClick={props.auditBack}
              >
                <span className="icon">
                  <i className="fas fa-2x fa-caret-left"></i>
                </span>
                <span>VOLVER A VOTAR</span>
              </button>
            </div>
            <div className="column pb-0">
              <figure className="image select-img-wrapper is-hidden-mobile">
                <img id="audit-final-img" src={auditImage} />
              </figure>
            </div>
            <div className="column">
              <button
                className="button is-medium"
                id="back-to-vote"
                onclick="BOOTH.reset_ciphertexts();BOOTH.seal_ballot();$(window).scrollTop(0);BOOTH.switch_background_image('03');"
              >
                <span>ENVIAR VOTO AUDITADO</span>
                <span className="icon">
                  <i className="fas fa-2x fa-caret-right"></i>
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AuditSection;
