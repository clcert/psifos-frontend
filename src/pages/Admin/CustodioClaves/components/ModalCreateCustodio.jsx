import { Link } from "react-router-dom";

function ModalCreateCustodio(props) {
  /**
   * Modal for show info before create a custodio
   */

  return (
    <div
      className={"modal " + (props.show ? "is-active" : "")}
      id="extend-modal"
    >
      <div className="modal-background" onClick={props.onHide}></div>

      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">Agregar Custodio de clave</h1>
          <div className="field">
            <label className="">
              Agregar su propio Custodio requiere un poco más de trabajo
              para contar la elección. Necesitará que los Custodios
              generen pares de claves y protejan su clave secreta. Si no está
              seguro de lo que eso significa, le recomendamos que haga clic en
              Cancelar y deje que Helios cuente la elección por usted.
            </label>
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="container level">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
              onClick={props.onHide}
            >
              <span>VOLVER ATRÁS</span>
            </button>
            <Link to={"/psifos/admin/" + props.uuid + "/create-trustee"}>
              <button
                className="button review-buttons previous-button has-text-white has-text-weight-bold level-right"
                onClick={props.onHide}
              >
                <span>AGREGAR</span>
              </button>
            </Link>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ModalCreateCustodio;
