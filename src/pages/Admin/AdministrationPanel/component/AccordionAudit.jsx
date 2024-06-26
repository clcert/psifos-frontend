import { Link, useParams } from "react-router-dom";
import { useRef, useEffect } from "react";
import React from "react";
import bulmaCollapsible from "@creativebulma/bulma-collapsible";
import { backendOpIP } from "../../../../server";

function AccordionAudit(props) {
  let collapsiblesRef = useRef(null);
  const [show, setShow] = React.useState(false);

  const { shortName } = useParams();

  useEffect(() => {
    bulmaCollapsible.attach(".is-collapsible", {
      container: collapsiblesRef.current,
    });
  }, []);

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
          <header className="card-header accordion-header">
            <p className="card-header-title accordion-title mb-0">
              Información de auditoria
            </p>

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
                  <div className="row-accordion is-full mb-3">
                    <p className="accordion-panel-title mb-0">URL Elección:</p>
                    <a className="accordion-panel-a">
                      {backendOpIP + "/" + shortName + "/vote"}
                    </a>
                  </div>
                  <div className="row-accordion is-full">
                    {" "}
                    <Link
                      to="/psifos/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/ballot-box"
                      className="accordion-link"
                    >
                      Ballot Tracking Center
                    </Link>{" "}
                    <span style={{ color: "black" }}>&nbsp;|&nbsp;&nbsp;</span>
                    <Link
                      to="/psifos/admin/a492ea80-8391-11ec-95c8-dcfb4829069d/ballot-box"
                      className="accordion-link"
                    >
                      Votos Auditados
                    </Link>{" "}
                    <span style={{ color: "black" }}>&nbsp;|&nbsp;&nbsp;</span>
                    <Link
                      to={"/psifos/admin/" + shortName + "/booth"}
                      className="accordion-link"
                    >
                      Vista previa
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

export default AccordionAudit;
