import { useState } from "react";
import { backendOpIP, frontIP } from "../../../../server";

function ModalDeleteElection(props) {
  const [feedback, setFeedback] = useState("");
  const [electionDelete, setElectionDelete] = useState(false);

  async function deleteElection() {
    const url = backendOpIP + "/delete-election/" + props.shortName;
    const token = localStorage.getItem("token");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    });
    if (response.status === 200) {
      setFeedback("La votación ha sido eliminada con exito!");
      setElectionDelete(true);
    } else {
      setFeedback("Ha ocurrido un error al eliminar la elección");
    }
  }

  return (
    <div
      className={"modal " + (props.show ? "is-active" : "")}
      id="extend-modal"
    >
      <div className="modal-background" onClick={props.onHide}></div>

      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">Eliminar votación</h1>
          <div className="field">
            <label className="">
              {!electionDelete
                ? "Estas seguro que quieres eliminar la votación?"
                : feedback}
            </label>
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="container level">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
              onClick={
                electionDelete
                  ? () => {
                      window.location.href = frontIP + "psifos/admin/home";
                    }
                  : props.onHide
              }
            >
              <span>VOLVER ATRÁS</span>
            </button>
            {!electionDelete && (
              <button
                className="button review-buttons previous-button has-text-white has-text-weight-bold level-right"
                onClick={deleteElection}
              >
                <span>ELIMINAR</span>
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

export default ModalDeleteElection;
