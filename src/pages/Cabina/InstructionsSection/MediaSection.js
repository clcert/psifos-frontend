
import sobre from "../../../static/cabina/svg/sobre.svg";
import instruccionesUser from "../../../static/cabina/svg/instrucciones-user.svg";




function MediaSection(props) {
  return (
    <section className="section py-0" id="info-media">
      <div className="container px-5">
        <div className="columns">
          <div className="column is-one-third is-flex is-flex-direction-column is-align-items-center pb-0 pt-6">
            <div
              className="box pb-0 pt-0 is-align-self-auto is-flex-grow-1"
              id="instruction-main-box-cabina"
            >
              <p id="instructions-main-paragraph-cabina">
                <img
                  src={sobre}
                  className="mr-4"
                  align="left"
                  id="instructions-main-image-cabina"
                  alt=""
                />
                Te damos la bienvenida al sistema Participa UChile. Para
                realizar tu sufragio debes seguir los pasos descritos más abajo.
                Si es tu primera vez utilizando el sistema, te sugerimos ver el
                siguiente video tutorial que te guiará con respecto a como
                completar el proceso de votación.
              </p>
            </div>

            <figure className="image img-wrapper is-hidden-mobile is-align-self-auto mt-auto">
              <img id="instructions-text-img-cabina" src={instruccionesUser} alt=""/>
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
  );
}

export default MediaSection;
