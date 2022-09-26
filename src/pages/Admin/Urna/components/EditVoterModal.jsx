import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { backendIP } from "../../../../server";

function EditVoterModal(props) {
  const [loginVoter, setLoginVoter] = useState("");
  const [weightVoter, setWeightVoter] = useState("");
  const [feecbackMessage, setFeedbackMessage] = useState("");
  const [typeAlert, setTypeAlert] = useState("is-success");

  /** @urlParam {string} uuid for election */
  const { uuid } = useParams();

  async function editVoter() {
    const token = sessionStorage.getItem("token");
    const resp = await fetch(
      backendIP + "/" + uuid + "/voters/" + props.voter.uuid + "/edit",
      {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,

          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          voter_login_id: loginVoter,
          voter_weight: weightVoter,
        }),
      }
    );
    if (resp.status === 200) {
      setTypeAlert("is-success");
      setFeedbackMessage("Votante editado con exito!");
    } else {
      setTypeAlert("is-danger");
      setFeedbackMessage("Ha ocurrido un error");
    }
  }

  useEffect(() => {
    setLoginVoter(props.voter.voter_login_id);
    setWeightVoter(props.voter.voter_weight);
  }, [props.voter]);

  return (
    <div
      className={"modal " + (props.show ? "is-active" : "")}
      id="extend-modal"
    >
      <div className="modal-background" onClick={props.onHide}></div>

      <div className="modal-card">
        <section className="modal-card-body">
          <h1 className="title">Editar al votante {props.voterName}</h1>
          <div className="">
            {feecbackMessage && (
              <div className={"notification " + typeAlert + " is-light"}>
                {feecbackMessage}
              </div>
            )}
            <div className="field mb-1">
              <label className="label">Login del votante</label>
              <div className="control">
                <input
                  className="input mr-2"
                  type="text"
                  value={loginVoter}
                  onChange={(e) => {
                    setLoginVoter(e.target.value);
                  }}
                ></input>
              </div>
            </div>
          </div>
          <div className="">
            <div className="field">
              <label className="label">Peso del votante</label>
              <div className="control">
                <input
                  className="input mr-2"
                  type="number"
                  value={weightVoter}
                  onChange={(e) => {
                    setWeightVoter(e.target.value);
                  }}
                ></input>
              </div>
            </div>
          </div>
        </section>
        <footer className="modal-card-foot">
          <div className="container level">
            <button
              className="button review-buttons previous-button has-text-white has-text-weight-bold level-left"
              onClick={() => {
                setFeedbackMessage("");
                props.update();
                props.onHide();
              }}
            >
              <span>VOLVER ATRÁS</span>
            </button>

            <button
              onClick={() => editVoter()}
              className="button review-buttons previous-button has-text-white has-text-weight-bold level-right"
            >
              <span>EDITAR</span>
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default EditVoterModal;
