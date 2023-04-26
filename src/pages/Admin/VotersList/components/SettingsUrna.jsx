import { Button } from "react-bulma-components";
import { backendOpIP } from "../../../../server";

function SettingsUrna(props) {
  let openReg = props.reg;
  const electionPrivate = false;
  const categories = false;

  function openregUpdate(event) {
    if (event.target.value === "openreg") {
      openReg = true;
    } else if (event.target.value === "closedreg") {
      openReg = false;
    }
  }

  async function updateRegElection() {
    const token = sessionStorage.getItem("token");
    const resp = await fetch(backendOpIP + "/" + props.shortName + "/openreg", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        openreg: openReg,
      }),
    });
    props.changeReg(openReg);
  }

  return (
    <>
      <div className="d-flex justify-content-center">
        {electionPrivate ? (
          <em>
            Your election is marked private, which means you cannot open
            registration up more widely
          </em>
        ) : (
          <div>
            Puedes cambiar esta configuración
            <div onChange={openregUpdate}>
              <label>
                <input
                  type="radio"
                  name="eligibility"
                  value="openreg"
                  defaultChecked={openReg}
                />{" "}
                Cualquiera puede votar
              </label>
              <br />
              <label>
                <input
                  type="radio"
                  name="eligibility"
                  value="closedreg"
                  defaultChecked={!openReg}
                />{" "}
                Las votantes enumeradas explícitamente a continuación pueden
                votar
              </label>
              <br />
              {categories && (
                <>
                  <input type="radio" name="eligibility" value="limitedreg" />{" "}
                  only voters who are members of
                  <select name="category_id">
                    {categories.map((category, index) => {
                      return <option key={index} value={category.id}></option>;
                    })}
                  </select>
                  <br />
                </>
              )}
              <br />
              <Button
                className="button-custom ml-3"
                onClick={() => {
                  updateRegElection();
                }}
              >
                Actualizar
              </Button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SettingsUrna;
