import FooterParticipa from "../../../component/Footers/FooterParticipa";
import Title from "../../../component/OthersComponents/Title";
import imageTrustees from "../../../static/svg/trustees-list.svg";
import ImageFooter from "../../../component/Footers/ImageFooter";
import TrusteesList from "./components/TrusteesList";
import getElection from "../../../utils/getElection";
import ButtonAlert from "../../../component/Alerts/ButtonAlert";
import { backendHeliosIP } from "../../../server";
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import "../../../static/css/booth.css";
import SubNavbar from "../component/SubNavbar";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import ModalCreateCustodio from "./components/ModalCreateCustodio";

function CustodioClaves() {
  const [nameElection, setNameElection] = useState("test");
  const [election, setElection] = useState([]);
  const [admin, setAdmin] = useState(true);
  const [forloop, setForLoop] = useState(true);
  const [modalCustodio, setModalCustodio] = useState(false);

  const { uuid } = useParams();
  const ipHeliosElection = backendHeliosIP + "/app/elections/" + uuid;

  useEffect(function effectFunction() {
    getElection(uuid).then((election) => {
      setElection(election);
    });
  }, []);
  return (
    <div id="content-trustees">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <NavbarAdmin />
          <Title namePage="Custodio de Claves" nameElection={nameElection} />
        </div>
      </section>

      <SubNavbar active={4} />

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
              )}
            </>
          )}
          <TrusteesList uuid={uuid} election={election} admin={admin} />
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
    </div>
  );
}

export default CustodioClaves;
