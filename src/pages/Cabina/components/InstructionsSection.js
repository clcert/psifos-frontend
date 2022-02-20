import seleccionar from "../../../static/cabina/img/seleccionar.jpg";
import revisar from "../../../static/cabina/img/revisar.jpg";
import enviar from "../../../static/cabina/img/enviar.jpg";
import CardInfo from "../components/CardInfo";
import seleccionarIcono from "../../../static/cabina/svg/seleccionar-ico-color.svg";
import revisarIcono from "../../../static/cabina/svg/revisar-ico-color.svg";

function InstructionsSection(props) {
  return (
    <section class="section" id="instructions">
      <div class="container has-text-centered steps-container">
        <div class="columns is-8 is-variable">
          <div class="column is-one-third">
            <CardInfo
              title="SELECCIÓN"
              icon={seleccionarIcono}
              info="Selecciona tu preferencia en cada una de las preguntas. Puedes fácilmente avanzar y retroceder de una pregunta a otra."
              image={seleccionar}
            ></CardInfo>
          </div>
          <div class="column is-one-third">
            <CardInfo
              title="REVISIÓN"
              icon={revisarIcono}
              info=" Puedes revisar tus selecciones y confirmarlas o corregirlas.
                Tus preferencias serán encriptadas para preservar el secreto
                del voto."
              image={revisar}
            ></CardInfo>
          </div>

          <div class="column is-one-third">
            <CardInfo
              title="ENVÍO"
              icon={revisarIcono}
              info=" Tu voto encriptado será enviado al servidor central y
                obtendrás un código serial con el cual podrás verificar que
                tu voto es contabilizado en el resultado final."
              image={enviar}
            ></CardInfo>
          </div>
        </div>
        <button
          class="button is-medium pl-6 pr-6"
          id="start-button-cabina"
          onclick="BOOTH.show_question(0, false);BOOTH.switch_background_image('02');$(window).scrollTop($('#progress_div').position().top);"
        >
          <span>COMENZAR</span>
          <span class="icon">
            <i class="fas fa-2x fa-caret-right"></i>
          </span>
        </button>
      </div>
    </section>
  );
}

export default InstructionsSection;
