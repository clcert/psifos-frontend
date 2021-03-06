import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import imageTrustees from "../../../static/svg/trustees-list.svg";
import ImageFooter from "../../../component/Footers/ImageFooter";
import TrusteesList from "./components/TrusteesList";
import { backendHeliosIP, backendIP } from "../../../server";
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

  /** @state {string} uuid trustee  */
  const [uuidTrustee, setUuidTrustee] = useState("");

  const location = useLocation();

  const { uuid } = useParams();
  const ipHeliosElection = backendHeliosIP + "/app/elections/" + uuid;

  useEffect(function effectFunction() {
    getElection(uuid).then((election) => {
      setElection(election.jsonResponse);
    });
  }, []);
  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Custodio de Claves" nameElection={election.name} />
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
                escrutinio de la elecci??n.
              </li>
              <li>
                Cada custodio de clave generar?? un par de claves (p??blica y
                privada), donde la clave p??blica es subida al servidor.
              </li>
              <li>
                Al momento de desencriptar el escrutinio, cada custodio de
                claves proveer?? su clave privada.
              </li>
            </ul>
          </div>
          {election.election_status === "Setting up" && (
            <>
              <>
                <button
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
                    <a
                      id="trustees-link"
                      href={ipHeliosElection + "/trustees/add-helios"}
                    >
                      agregar al servidor como custodio de clave
                    </a>
                    ]
                  </p>
                )}
              </>
            </>
          )}
          <div className="box" id="trustee-box">
            Link de conexi??n custodio:{" "}
            <a
              target="_blank"
              style={{ color: "rgb(0, 182, 254)" }}
              href={backendIP + "/" + uuid + "/trustee/login"}
            >
              {backendIP + "/" + uuid + "/trustee/login"}
            </a>
          </div>
          <TrusteesList
            deleteTrustee={(uuid) => {
              setUuidTrustee(uuid);
              setModalDelete(true);
            }}
            uuid={uuid}
            election={election}
          />
        </div>
      </section>
      <div>
        <ImageFooter imagePath={imageTrustees} />
        <FooterParticipa message="PARTICIPA.UCHILE es un proyecto de la Universidad de Chile - 2021" />
      </div>
      <ModalCreateCustodio
        show={modalCustodio}
        onHide={() => setModalCustodio(false)}
        uuid={uuid}
      />
      <ModalDeleteCustodio
        show={modalDelete}
        onHide={() => setModalDelete(false)}
        uuid={uuid}
        uuidTrustee={uuidTrustee}
      />
    </div>
  );
}

export default CustodioClaves;
