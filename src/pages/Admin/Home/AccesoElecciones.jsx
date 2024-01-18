import Accordion from "./component/Accordion";
import { Button } from "react-bulma-components";
import { Link } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { getElections } from "../../../services/election";
import { normalizedLowerCase } from "../../../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { setElections } from "../../../store/slices/electionSlice";

function CreateElectionButton() {
  return (
    <div className="d-flex justify-content-between header-item">
      <div className="d-flex">
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
  );
}

function SearchElectionInput({ numElections, inputHandler }) {
  return (
    <div className="d-flex header-item">
      {numElections !== 0 && (
        <input
          className="home-admin-search level-item"
          type="text"
          placeholder="Buscar"
          onChange={inputHandler}
        />
      )}
    </div>
  );
}

export default function AccesoElecciones() {
  /**
   * View home for admin
   */
  const dispatch = useDispatch();
  const elections = useSelector((state) => state.election.elections);

  /** @state {array} choices filtered by the search engine  */
  const [electionsSearch, setElectionsSearch] = useState([]);

  const [load, setLoad] = useState(false);

  const initComponent = useCallback(() => {
    getElections().then((res) => {
      const { resp, jsonResponse } = res;
      if (resp.status === 200) {
        dispatch(setElections(jsonResponse));
        setElectionsSearch(jsonResponse);
        setLoad(true);
      }
    });
  }, [dispatch]);

  useEffect(() => {
    initComponent();
  }, [initComponent]);
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
    <>
      {load ? (
        <div>
          <div className="header-accordion mb-3">
            <SearchElectionInput
              numElections={elections.length}
              inputHandler={searchElection}
            />
            <CreateElectionButton />
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
        <div className="d-flex justify-content-center">
          <div className="spinner-animation" />
        </div>
      )}
    </>
  );
}
