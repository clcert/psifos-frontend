import React from "react";

import NavHome from "../Navbar/NavHom";
import ScrollButton from "./ScrollButton";

import mono from "../../static/new_home_assets/SVG/monito.svg";
import logoParticipa from "../../static/new_home_assets/SVG/logo participa.svg";
import logoUchile from "../../static/new_home_assets/SVG/logo uchile.svg";

function UpperBanner({ title = "", subtitle = "" }) {
  document.addEventListener("DOMContentLoaded", () => {
    // Functions to open and close a modal
    function openModal($el) {
      $el.classList.add("is-active");
    }

    function closeModal($el) {
      $el.classList.remove("is-active");
    }

    function closeAllModals() {
      (document.querySelectorAll(".modal") || []).forEach(($modal) => {
        closeModal($modal);
      });
    }

    // Add a click event on buttons to open a specific modal
    (document.querySelectorAll(".js-modal-trigger") || []).forEach(
      ($trigger) => {
        const modal = $trigger.dataset.target;
        const $target = document.getElementById(modal);

        $trigger.addEventListener("click", () => {
          openModal($target);
        });
      }
    );

    // Add a click event on various child elements to close the parent modal
    (
      document.querySelectorAll(
        ".modal-background, .modal-close, .modal-card-head .delete, .modal-card-foot .button"
      ) || []
    ).forEach(($close) => {
      const $target = $close.closest(".modal");

      $close.addEventListener("click", () => {
        closeModal($target);
      });
    });

    // Add a keyboard event to close all modals
    document.addEventListener("keydown", (event) => {
      const e = event || window.event;

      if (e.keyCode === 27) {
        // Escape key
        closeAllModals();
      }
    });
  });

  return (
    <>
      <div className="navbar-div">
        <div className="container">
          <NavHome logo={logoParticipa} />
        </div>
      </div>
      <ScrollButton></ScrollButton>

      <section className="section demo-election-section py-0">
        <div className="container is-flex is-justify-content-right">
          <button
            className="button demo-election-button js-modal-trigger"
            data-target="modal-js-demo-election"
          >
            ¡Prueba nuestro sistema!
          </button>
        </div>
      </section>

      <div id="modal-js-demo-election" className="modal demo-election-modal">
        <div className="modal-background"></div>
        <div className="modal-content" style={{ width: "640px" }}>
          <section className="modal-card-body">
            <div className="is-flex is-align-items-center">
              <figure
                className="image px-4 mini-uchile-logo"
                style={{ width: "150px" }}
              >
                <img
                  src={process.env.PUBLIC_URL + "/Fotos/logoUchilemorado.png"}
                  alt=""
                />
              </figure>
              <p className="has-text-weight-bold has-text-centered pr-4">
                Los únicos requisitos para acceder a la prueba es pertenecer a
                la comunidad de la Universidad de Chile y tener una "Mi Cuenta
                Uchile" habilitada. Para más información de la cuenta{" "}
                <a
                  href="http://pasaporte.uchile.cl/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ingresa aquí.
                </a>
              </p>
            </div>
            <a
              href="https://participa.uchile.cl/psifos/api/app/eleccion-prueba/vote"
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <button
                className="mt-2 button demo-enter-button is-outlined"
                onclick="$('.modal-background').click();"
              >
                <span className="has-text-white">
                  ACCEDER A ELECCIÓN DE PRUEBA AQUÍ
                </span>
              </button>
            </a>
          </section>
        </div>
        <button className="modal-close is-large" aria-label="close"></button>
      </div>

      <section className="section top-section pt-3 is-hidden-touch">
        <div className="columns container " style={{ height: "157px" }}>
          <div className="column is-align-self-center  pl-6">
            <figure
              className="image"
              style={{ width: "316px", height: "374px" }}
            >
              <img src={mono} alt="" />
            </figure>
          </div>
          <div className="column is-align-self-center">
            <p className="has-text-weight-bold text-title">
              {title !== "" && (
                <>
                  <span className="big-text-title">{title}</span>
                  <br />
                </>
              )}
              {subtitle !== "" && subtitle}
            </p>
          </div>
          <div className="column is-align-self-center is-flex is-flex-direction-row is-justify-content-center is-align-items-center">
            <figure className="image mb-0" style={{ width: "300px" }}>
              <img src={logoParticipa} alt="Logo participa" />
            </figure>
            <div className="barra-menu mx-2" style={{ height: "50px" }}></div>
            <figure className="image mb-0" style={{ width: "40px" }}>
              <img src={logoUchile} alt="Logo Uchile" />
            </figure>
          </div>
          {/* <div className="barra-menu"></div>
          <div className="column is-align-self-center">
            <figure className="image" style={{ width: "70px" }}>
              <img src={logoUchile} alt="Logo Uchile" />
            </figure>
          </div> */}
        </div>
      </section>
    </>
  );
}

export default UpperBanner;
