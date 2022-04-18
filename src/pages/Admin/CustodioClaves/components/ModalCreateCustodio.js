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
              Adding your own trustee requires a good bit more work to tally the
              election.\nYou will need to have trustees generate keypairs and
              safeguard their secret key.\n\nIf you are not sure what that
              means, we strongly recommend\nclicking Cancel and letting Helios
              tally the election for you.
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
            <Link to={"/admin/" + props.uuid + "/createCustodio"}>
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
