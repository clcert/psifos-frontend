import FooterParticipa from "../../../component/Footers/FooterParticipa";
import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import imageTrustees from "../../../static/svg/trustees-list.svg";
import ImageFooter from "../../../component/Footers/ImageFooter";
import TrusteesList from "./components/TrusteesList";
import { backendOpIP } from "../../../server";
import "../../../static/css/booth.css";
import SubNavbar from "../component/SubNavbar";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import ModalCreateCustodio from "./components/ModalCreateCustodio";
import ModalDeleteCustodio from "./components/ModalDeleteCustodio";

import { useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { getElection } from "../../../services/election";

function CustodioClaves(props) {
  /** @state {json} election data  */
  const [election, setElection] = useState({});

  /** @state {boolean} state of modal with create info  */
  const [modalCustodio, setModalCustodio] = useState(false);

  /** @state {boolean} state of model with delete trustee info  */
  const [modalDelete, setModalDelete] = useState(false);

  /** @state {string} shortName trustee  */
  const [uuidTrustee, setUuidTrustee] = useState("");

  const location = useLocation();

  const { shortName } = useParams();

  useEffect(
    function effectFunction() {
      getElection(shortName).then((election) => {
        setElection(election.jsonResponse);
      });
    },
    [shortName]
  );
  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <TitlePsifos
            namePage="Custodio de Claves"
            nameElection={election.name}
          />
        </div>
      </section>

      <SubNavbar active={4} />

      <section className="section" id="medium-section">
        <div className="container has-text-centered is-max-desktop">
          {location.state && (
            <div className="notification is-primary is-light">
              {location.state.message}
            </div>
          )}
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
          {election.election_status === "Setting up" && (
            <>
              <>
                <button
                  id="add-trustee"
                  className="button mb-4"
                  onClick={() => {
                    setModalCustodio(true);
                  }}
                >
                  AGREGAR CUSTODIO DE CLAVE
                </button>
                {!election.has_helios_trustee && (
                  <p className="has-text-white mb-4">
                    [
                    <span id="trustees-link">
                      agregar al servidor como custodio de clave
                    </span>
                    ]
                  </p>
                )}
              </>
            </>
          )}
          <div className="box" id="trustee-box">
            Link de conexión custodio:{" "}
            <a
              rel="noreferrer"
              target="_blank"
              style={{ color: "rgb(0, 182, 254)" }}
              href={backendOpIP + "/" + shortName + "/trustee/login"}
            >
              {backendOpIP + "/" + shortName + "/trustee/login"}
            </a>
          </div>
          <TrusteesList
            deleteTrustee={(uuid) => {
              setUuidTrustee(uuid);
              setModalDelete(true);
            }}
            election={election}
          />
        </div>
      </section>
      <div>
        <ImageFooter imagePath={imageTrustees} />
        <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
      </div>
      <ModalCreateCustodio
        show={modalCustodio}
        onHide={() => setModalCustodio(false)}
        shortName={shortName}
      />
      <ModalDeleteCustodio
        show={modalDelete}
        onHide={() => setModalDelete(false)}
        shortName={shortName}
        uuidTrustee={uuidTrustee}
      />
    </div>
  );
}

export default CustodioClaves;
