import $ from "jquery";
import parallax01 from "../../static/cabina/img/parallax01.jpg";
import parallax02 from "../../static/cabina/img/parallax02.jpg";
import parallax03 from "../../static/cabina/img/parallax03.jpg";
import parallax04 from "../../static/cabina/img/parallax04.jpg";

function HomeCabin(props) {
  return (
    <>
      <section className="section py-0" id="info-media">
        <div className="container px-5">
          <div className="columns">
            <div className="column is-one-third is-flex is-flex-direction-column is-align-items-center pb-0 pt-6">
              <div
                className="box pb-0 pt-0 is-align-self-auto is-flex-grow-1"
                id="instruction-main-box"
              >
                <p id="instructions-main-paragraph">
                  <img
                    src="svg/sobre.svg"
                    className="mr-4"
                    align="left"
                    id="instructions-main-image"
                  />
                  Te damos la bienvenida al sistema Participa UChile. Para
                  realizar tu sufragio debes seguir los pasos descritos más
                  abajo. Si es tu primera vez utilizando el sistema, te
                  sugerimos ver el siguiente video tutorial que te guiará con
                  respecto a como completar el proceso de votación.
                </p>
              </div>

              <figure className="image img-wrapper is-hidden-mobile is-align-self-auto mt-auto">
                <img
                  id="instructions-text-img"
                  src="svg/instrucciones-user.svg"
                />
              </figure>
            </div>
            <div className="column has-text-centered video-column py-6">
              <figure className="image is-16by9">
                <iframe
                  className="has-ratio"
                  width="640"
                  height="360"
                  src="https://www.youtube.com//embed/9sVCptKbr48"
                  frameborder="0"
                  allowfullscreen
                ></iframe>
              </figure>
            </div>
          </div>
        </div>
      </section>

      <section className="section" id="instructions">
        <div className="container has-text-centered steps-container">
          <div className="columns is-8 is-variable">
            <div className="column is-one-third">
              <div className="card">
                <header className="card-header">
                  <div className="card-header-icon">
                    <span className="icon step-icon">
                      <img src="svg/seleccionar-ico-color.svg" />
                    </span>
                  </div>
                  <p className="card-header-title is-size-5 pl-0">SELECCIÓN</p>
                </header>
                <div className="card-image">
                  <figure className="image step-figure">
                    <img
                      className="instruction-image"
                      id="select-image"
                      src="img/seleccionar.jpg"
                      alt="Placeholder image"
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content step-text">
                    Selecciona tu preferencia en cada una de las preguntas.
                    Puedes fácilmente avanzar y retroceder de una pregunta a
                    otra.
                  </div>
                </div>
              </div>
            </div>
            <div className="column is-one-third">
              <div className="card">
                <header className="card-header">
                  <div className="card-header-icon">
                    <span className="icon step-icon">
                      <img src="svg/revisar-ico-color.svg" />
                    </span>
                  </div>
                  <p className="card-header-title is-size-5 pl-0">REVISIÓN</p>
                </header>
                <div className="card-image">
                  <figure className="image step-figure">
                    <img
                      className="instruction-image"
                      id="review-image"
                      src="img/revisar.jpg"
                      alt="Placeholder image"
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content step-text">
                    Puedes revisar tus selecciones y confirmarlas o corregirlas.
                    Tus preferencias serán encriptadas para preservar el secreto
                    del voto.
                  </div>
                </div>
              </div>
            </div>

            <div className="column is-one-third">
              <div className="card">
                <header className="card-header">
                  <div className="card-header-icon">
                    <span className="icon step-icon">
                      <img src="svg/enviar-ico-color.svg" />
                    </span>
                  </div>
                  <p className="card-header-title is-size-5 pl-0">ENVÍO</p>
                </header>
                <div className="card-image">
                  <figure className="image step-figure">
                    <img
                      className="instruction-image"
                      id="send-image"
                      src="img/enviar.jpg"
                      alt="Placeholder image"
                    />
                  </figure>
                </div>
                <div className="card-content">
                  <div className="content step-text">
                    Tu voto encriptado será enviado al servidor central y
                    obtendrás un código serial con el cual podrás verificar que
                    tu voto es contabilizado en el resultado final.
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button
            className="button is-medium pl-6 pr-6"
            id="start-button"
            onclick="BOOTH.show_question(0, false);BOOTH.switch_background_image('02');$(window).scrollTop($('#progress_div').position().top);"
          >
            <span>COMENZAR</span>
            <span className="icon">
              <i className="fas fa-2x fa-caret-right"></i>
            </span>
          </button>
        </div>
      </section>
    </>
  );
}

export default HomeCabin;
