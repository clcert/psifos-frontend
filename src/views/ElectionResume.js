import { Container, Image } from "react-bootstrap";
import ElectionCode from "../component/ElectionCode";
import MyNavbar from "../component/MyNavbar";
import trustees from "../static/svg/trustees-list.svg";
import "../static/css/booth.css";

function ElectionResume() {
  return (
    <div id="content-voters">
      <section class="parallax hero is-medium">
        <div className="hero-body pt-0 px-0 header-hero">
          <MyNavbar></MyNavbar>
          <div
            class="has-text-centered mt-6 py-3"
            id="election-title-background"
          >
            <h1
              class="title has-text-black is-size-4-mobile"
              id="election-title"
            >
              RESUMEN DE ELECCIÓN
              <br />
              wu
            </h1>
          </div>
        </div>
      </section>
      <section class="section voters-section is-flex is-flex-direction-column is-align-items-center">
        <div>
          <h1 class="title is-size-4">Apertura de Urna</h1>
        </div>

        <div className="disable-text-selection row justify-content-md-center">
          <table
            id="resume-table"
            class="mt-2 table is-bordered is-hoverable voters-table"
          >
            <tr>
              <td>Votos Recibidos</td>
              <td class="has-text-centered">{1}</td>
            </tr>
            <tr>
              <td>Total Padrón</td>
              <td class="has-text-centered">{2}</td>
            </tr>
            <tr>
              <td>Participación</td>
              <td class="has-text-centered">{3}</td>
            </tr>
          </table>
        </div>
        <div>
          <h1 class="title is-size-4 pt-4">
            Número de votantes por ponderación
          </h1>
        </div>
        <div className="disable-text-selection row justify-content-md-center">
          <table
            id="weights-table"
            class="mt-2 table is-bordered is-hoverable voters-table"
          >
            <tr>
              <th>Ponderador</th>
              <th>Preliminar</th>
              <th>Inicial</th>
              <th>Votos Recibidos</th>
              <th>Efectivo</th>
            </tr>

            <tr>
              <td class="has-text-centered">{2}</td>
              <td class="has-text-centered"></td>
              <td class="has-text-centered"></td>
              <td class="has-text-centered"></td>
              <td class="has-text-centered">{2}</td>
            </tr>
          </table>
        </div>
      </section>

      <section
        class="section pb-0 is-flex is-justify-content-center is-align-content-flex-end"
        id="drawing-section"
      >
        <figure class="image">
          <Image id="send-final-img" src={trustees} />
        </figure>
      </section>
      <footer class="footer">
        <ElectionCode />
      </footer>
      <section class="hero">
        <div class="hero-body bottom-hero"></div>
      </section>
    </div>
  );
}

export default ElectionResume;
