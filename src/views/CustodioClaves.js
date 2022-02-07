import FooterParticipa from "../component/FooterParticipa";
import MyNavbar from "../component/MyNavbar";
import Title from "../component/Title";
import { useState } from "react";
import "../static/css/booth.css";
import imageTrustees from "../static/svg/trustees-list.svg";
import ImageFooter from "../component/ImageFooter";

function CustodioClaves() {
  const [nameElection, setNameElection] = useState("test");
  const [election, setElection] = useState(true);
  const [trustees, setTrustees] = useState([]);
  const [admin, setAdmin] = useState(true);
  const [forloop, setForLoop] = useState(true);

  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body py-0 px-0 header-hero">
          <MyNavbar />
          <Title namePage="Custodio de Claves" nameElection={nameElection} />
        </div>
      </section>

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          <div className="content d-flex justify-content-center">
            <ul className="has-text-white has-text-left">
              <li>
                Los custodios de claves son los responsables de desencriptar el
                escrutinio de la elección.
              </li>
              <li>
                Cada custodio de clave generará un par de claves (pública y
                privada), donde la clave pública es subida al servidor.
              </li>
              <li>
                Al momento de desencriptar el escrutinio, cada custodio de
                claves proveerá su clave privada.
              </li>
            </ul>
          </div>
          {!election.frozen_at && (
            <>
              {admin && (
                <>
                  <a onclick="" href="">
                    <button className="button mb-4">
                      <span>AGREGAR CUSTODIO DE CLAVE</span>
                    </button>
                  </a>
                  {!election.has_helios_trustee && (
                    <p className="has-text-white mb-4">
                      [
                      <a id="trustees-link" href="">
                        agregar al servidor como custodio de clave
                      </a>
                      ]
                    </p>
                  )}
                </>
              )}
            </>
          )}
          {!trustees ? (
            <></> // TODO: Revisar condición
          ) : (
            <>
              {trustees.map((t) => {
                return (
                  <div className="box" id="trustee-box">
                    <span className="has-text-weight-bold is-size-4">
                      Custodio de Clave #{forloop.counter}: {t.name}
                      {admin && (
                        <>
                          {t.secret_key ? (
                            <>
                              {!election.frozen_at && (
                                <a
                                  id="trustees-link"
                                  onclick="return confirm('Are you sure you want to remove Helios as a trustee?');"
                                  href=""
                                >
                                  eliminar
                                </a>
                              )}
                            </>
                          ) : (
                            <>
                              <br />
                              {t.email}
                              {!election.frozen_at && (
                                <a
                                  id="trustees-link"
                                  onclick="return confirm('Are you sure you want to remove this Trustee?');"
                                  href=""
                                >
                                  eliminar
                                </a>
                              )}
                              <a
                                id="trustees-link"
                                onclick="return confirm('Are you sure you want to send this trustee his/her admin URL?');"
                                href=""
                              >
                                enviar link
                              </a>
                            </>
                          )}
                        </>
                      )}
                    </span>

                    <p className="mt-4" id="pk-{{ forloop.counter0 }}">
                      Custodio aún no sube su clave pública.
                    </p>

                    {election.encrypted_tally && (
                      <p
                        id="status-decryption-{{ forloop.counter0 }}"
                        className="has-text-weight-bold is-size-5 status-decryption is-flex is-flex-direction-column"
                      >
                        ESPERANDO DESENCRIPTACIÓN PARCIAL
                        <img
                          className="is-align-self-center loading-trustee"
                          src="{{ settings.STATIC_URL }}app/loading2.gif"
                        />
                      </p>
                    )}
                  </div>
                );
              })}
            </>
          )}
        </div>
      </section>

      <ImageFooter imagePath={imageTrustees} />
      <FooterParticipa />
    </div>
  );
}

export default CustodioClaves;
