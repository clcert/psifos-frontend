import { backendIP } from "../../../server";

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
    const resp = await fetch(
      backendIP + "/elections/" + props.uuid + "/openreg",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          openreg: openReg,
        }),
      }
    );
    const data = await resp.json();
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
              <input
                type="radio"
                name="eligibility"
                value="openreg"
                defaultChecked={openReg}
              />{" "}
              Cualquiera puede votar
              <br />
              <input
                type="radio"
                name="eligibility"
                value="closedreg"
                defaultChecked={!openReg}
              />{" "}
              Las votantes enumeradas explícitamente a continuación pueden votar
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
              <button
                onClick={() => {
                  updateRegElection();
                }}
              >
                Actualizar
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default SettingsUrna;
