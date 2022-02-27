import React, { useEffect, useRef } from "react";
import bulmaCollapsible from "@creativebulma/bulma-collapsible";
import "../../../../static/cabina/css/booth.scss";
import { Link } from "react-router-dom";

function Accordion(props) {
  let collapsiblesRef = useRef(null);
  const [show, setShow] = React.useState(false);

  useEffect(() => {
    bulmaCollapsible.attach(".is-collapsible", {
      container: collapsiblesRef.current,
    });
  }, []);

  return (
    <div ref={collapsiblesRef} id="accordion_first">
      <div className="card" className="card-accordion">
        <a
          href="#collapsible-card"
          onClick={() => {
            setShow(!show);
          }}
          data-action="collapse"
          className="card-header-icon is-hidden-fullscreen pt-0 pr-0 pb-0 accordion-a"
        >
          <header className="card-header accordion-header">
            <p className="card-header-title accordion-title mb-0">
              {props.electionName}
            </p>
            <span className="accordion-state">{props.state}</span>

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
                      to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/panel"
                      className="accordion-link"
                    >
                      Panel administración
                    </Link>{" "}
                  </div>
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/resumen"
                      className="accordion-link"
                    >
                      Resumen
                    </Link>{" "}
                  </div>
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/urna"
                      className="accordion-link"
                    >
                      Urna
                    </Link>{" "}
                  </div>
                </div>
                <div className="rows column">
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/custodio"
                      className="accordion-link"
                    >
                      Custodio de claves
                    </Link>{" "}
                  </div>
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/resultado"
                      className="accordion-link"
                    >
                      Resultados
                    </Link>{" "}
                  </div>
                  <div className="row-accordion is-full">
                    <Link
                      to="/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/panel"
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
