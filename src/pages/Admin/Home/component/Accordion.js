import React, { useEffect, useRef } from "react";
import bulmaCollapsible from "@creativebulma/bulma-collapsible";
import "../../../../static/cabina/css/booth.scss";

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
            <span className="accordion-state">En curso</span>
            

            <span className="icon">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </header>
        </a>
        {show ? (
          <div id="collapsible-card" className="is-collapsible" style={{overflowX: "hidden"}}>
            <div className="card-content accordion-content pl-4">
              <div className="columns">
                <div class="rows column">
                  <div class="row-accordion is-full">
                    {" "}
                    <a className="accordion-link">Panel administración</a>{" "}
                  </div>
                  <div class="row-accordion is-full">
                    {" "}
                    <a className="accordion-link">Resumen</a>{" "}
                  </div>
                  <div class="row-accordion is-full">
                    {" "}
                    <a className="accordion-link">Urna</a>{" "}
                  </div>
                </div>
                <div class="rows column">
                  <div class="row-accordion is-full">
                    {" "}
                    <a className="accordion-link">Custodio de claves</a>{" "}
                  </div>
                  <div class="row-accordion is-full">
                    {" "}
                    <a className="accordion-link">Resultados</a>{" "}
                  </div>
                  <div class="row-accordion is-full">
                    <a className="accordion-link">Preguntas</a>{" "}
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
