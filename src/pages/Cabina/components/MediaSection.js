
import sobre from "../../../static/cabina/svg/sobre.svg";
import instruccionesUser from "../../../static/cabina/svg/instrucciones-user.svg";




function MediaSection(props) {
  return (
    <section class="section py-0" id="info-media">
      <div class="container px-5">
        <div class="columns">
          <div class="column is-one-third is-flex is-flex-direction-column is-align-items-center pb-0 pt-6">
            <div
              class="box pb-0 pt-0 is-align-self-auto is-flex-grow-1"
              id="instruction-main-box-cabina"
            >
              <p id="instructions-main-paragraph-cabina">
                <img
                  src={sobre}
                  class="mr-4"
                  align="left"
                  id="instructions-main-image-cabina"
                />
                Te damos la bienvenida al sistema Participa UChile. Para
                realizar tu sufragio debes seguir los pasos descritos más abajo.
                Si es tu primera vez utilizando el sistema, te sugerimos ver el
                siguiente video tutorial que te guiará con respecto a como
                completar el proceso de votación.
              </p>
            </div>

            <figure class="image img-wrapper is-hidden-mobile is-align-self-auto mt-auto">
              <img id="instructions-text-img-cabina" src={instruccionesUser} />
            </figure>
          </div>
          <div class="column has-text-centered video-column py-6">
            <figure class="image is-16by9">
              <iframe
                class="has-ratio"
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
  );
}

export default MediaSection;
