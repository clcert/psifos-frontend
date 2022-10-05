import seleccionar from "../../../../static/booth/img/seleccionar.jpg";
import revisar from "../../../../static/booth/img/revisar.jpg";
import enviar from "../../../../static/booth/img/enviar.jpg";
import CardInfo from "./CardInfo";
import seleccionarIcono from "../../../../static/booth/svg/seleccionar-ico-color.svg";
import revisarIcono from "../../../../static/booth/svg/revisar-ico-color.svg";

function InstructionsSection(props) {
  return (
    <section className="section" id="instructions">
      <div className="container has-text-centered steps-container">
        <div className="columns is-8 is-variable">
          <div className="column is-one-third">
            <CardInfo
              title="SELECCIÓN"
              icon={seleccionarIcono}
              info="Selecciona tu preferencia en cada una de las preguntas. Puedes fácilmente avanzar y retroceder de una pregunta a otra."
              image={seleccionar}
            ></CardInfo>
          </div>
          <div className="column is-one-third">
            <CardInfo
              title="REVISIÓN"
              icon={revisarIcono}
              info=" Puedes revisar tus selecciones y confirmarlas o corregirlas.
                Tus preferencias serán encriptadas para preservar el secreto
                del voto."
              image={revisar}
            ></CardInfo>
          </div>

          <div className="column is-one-third">
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
          className="button is-medium pl-6 pr-6"
          id="start-button-cabina"
          onClick={() => {
            props.beginAction();
          }}
        >
          <span>COMENZAR</span>
          <span className="icon">
            <i className="fas fa-2x fa-caret-right"></i>
          </span>
        </button>
      </div>
    </section>
  );
}

export default InstructionsSection;
