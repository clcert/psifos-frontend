import TitlePsifos from "../../../component/OthersComponents/TitlePsifos";
import Accordion from "./component/Accordion";
import { Button } from "react-bulma-components";
import FooterParticipa from "../../../component/Footers/FooterParticipa";
import NavbarAdmin from "../../../component/ShortNavBar/NavbarAdmin";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getElections } from "../../../services/election";
import { normalizedLowerCase } from "../../../utils/utils";

function HomeAdmin() {
  /**
   * View home for admin
   */

  /** @state {array} all elections for the current admin  */
  const [elections, setElections] = useState([]);

  /** @state {array} choices filtered by the search engine  */
  const [electionsSearch, setElectionsSearch] = useState([]);

  const [load, setLoad] = useState(false);

  useEffect(() => {
    getElections().then((res) => {
      const { resp, jsonResponse } = res;
      if (resp.status === 200) {
        setElections(jsonResponse);
        setElectionsSearch(jsonResponse);
        setLoad(true);
      }
    });
  }, []);
  /**
   * Search substring
   * @param {*} input
   */
  function searchSubstring(input, substring) {
    const inputLowerCase = input.toLowerCase();
    const substringLowerCase = substring.toLowerCase();
    const inputNormalized = normalizedLowerCase(input);
    const substringNormalized = normalizedLowerCase(substring);

    return (
      inputNormalized.includes(substringNormalized) ||
      inputLowerCase.includes(substringLowerCase)
    );
  }
  function searchElection(e) {
    /**
     * Search for elections by name
     */

    const search = e.target.value;
    const newElections = elections.filter((election) => {
      return searchSubstring(election.short_name, search);
    });
    setElectionsSearch(newElections);
  }

  return (
    <div id="content-home-admin">
      <section id="header-section" className="parallax hero is-medium">
        <div className="hero-body py-0 px-0 header-hero">
          <NavbarAdmin />
          <TitlePsifos namePage="Bienvenido(a) a Participa UChile DEV" />
        </div>
      </section>

      <section
        className="section columns is-flex is-vcentered is-centered mt-5 mb-0"
        id="accordion-section"
      >
        {load ? (
          <div className="body-content home-admin-principal">
            <div className="header-accordion mb-4">
              <div className="d-flex">
                {elections.length !== 0 && (
                  <input
                    className="home-admin-search level-item"
                    type="text"
                    placeholder="Buscar"
                    onChange={searchElection}
                  />
                )}
              </div>
              <div className="d-flex justify-content-between mt-4">
               {elections.length !== 0 && (
                  <div className="d-flex mt-2">
                    <Link
                      style={{ textDecoration: "none", color: "white" }}
                      className="link-button"
                      to="/psifos/admin/general"
                    >
                      <Button className="button-custom home-admin-button btn-fixed">
                        Detalle votaciones
                      </Button>
                    </Link>
                  </div>
                )}
                <div className="d-flex mt-2">
                  <Link
                    style={{ textDecoration: "none", color: "white" }}
                    className="link-button"
                    to="/psifos/admin/create-election"
                  >
                    <Button
                      id="button-create-election"
                      className="button-custom home-admin-button btn-fixed"
                    >
                      Crear Votación
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            <div className="home-admin-accordion-section">
              {elections.length !== 0 ? (
                <>
                  {Object.keys(electionsSearch).map((key) => {
                    return (
                      <Accordion key={key} election={electionsSearch[key]} />
                    );
                  })}
                </>
              ) : (
                <div className="box has-text-centered" id="not-results-box">
                  <p className="is-size-3 has-text-weight-bold mb-0">
                    Aun no existen elecciones registradas.
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="spinner-animation"></div>
        )}
      </section>
      <FooterParticipa message="Participa UChile es un proyecto de CLCERT - Universidad de Chile" />
    </div>
  );
}

export default HomeAdmin;
