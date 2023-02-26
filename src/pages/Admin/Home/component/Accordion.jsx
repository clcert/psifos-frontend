import React, { useCallback, useEffect, useRef, useState } from "react";
import bulmaCollapsible from "@creativebulma/bulma-collapsible";
import "../../../../static/booth/css/booth.scss";
import { Link } from "react-router-dom";

function Accordion(props) {
  let collapsiblesRef = useRef(null);
  const [show, setShow] = useState(false);
  const [stateElection, setStateElection] = useState("");

  const state = useCallback(() => {
    if (props.election.election_status === "Setting up") {
      setStateElection("En configuración");
    } else if (props.election.election_status === "Started") {
      setStateElection("En curso");
    } else {
      setStateElection("Finalizada");
    }
  }, [props.election.election_status]);

  useEffect(() => {
    bulmaCollapsible.attach(".is-collapsible", {
      container: collapsiblesRef.current,
    });
    state();
  }, [state]);

  return (
    <div ref={collapsiblesRef} id="accordion_first">
      <div className="card-accordion">
        <a
          href="#collapsible-card"
          onClick={() => {
            setShow(!show);
          }}
          data-action="collapse"
          className="card-header-icon is-hidden-fullscreen pt-0 pr-0 pb-0 accordion-a"
        >
          <header className="card-header accordion-header p-2">
            <p className="card-header-title accordion-title mb-0">
              {props.election.short_name}
            </p>
            <span className="accordion-state">{stateElection}</span>

            <span className="icon">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </header>
        </a>
        {show ? (
          <div
            id="collapsible-card"
            className="is-collapsible"
            style={{ overflowX: "hidden" }}
          >
            <div className="card-content accordion-content pl-4">
              <div className="columns pl-3 pr-3">
                <div className="rows column">
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to={"/psifos/admin/" + props.election.uuid + "/panel"}
                      className="accordion-link"
                    >
                      Panel administración
                    </Link>{" "}
                  </div>
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to={"/psifos/admin/" + props.election.uuid + "/resumen"}
                      className="accordion-link"
                    >
                      Resumen
                    </Link>{" "}
                  </div>
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to={
                        "/psifos/admin/" + props.election.uuid + "/voters-list"
                      }
                      className="accordion-link"
                    >
                      Padrón
                    </Link>{" "}
                  </div>
                </div>
                <div className="rows column">
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to={"/psifos/admin/" + props.election.uuid + "/trustee"}
                      className="accordion-link"
                    >
                      Custodio de claves
                    </Link>{" "}
                  </div>
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to={"/psifos/admin/" + props.election.uuid + "/resultado"}
                      className="accordion-link"
                    >
                      Resultados
                    </Link>{" "}
                  </div>
                  <div className="row-accordion is-full">
                    <Link
                      to={
                        "/psifos/admin/" +
                        props.election.uuid +
                        "/create-question"
                      }
                      className="accordion-link"
                    >
                      Preguntas
                    </Link>{" "}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
export default Accordion;
