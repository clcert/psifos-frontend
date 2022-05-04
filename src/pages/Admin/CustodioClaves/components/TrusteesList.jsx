import { useState } from "react";
import { useEffect } from "react";
import { backendIP, backendHeliosIP } from "../../../../server";
import TextAlert from "../../../../component/Alerts/TextAlert";
import { Button } from "react-bulma-components";
function TrusteesList(props) {
  const [trustees, setTrustees] = useState([]);

  useEffect(function effectFunction() {
    async function getTrustees() {
      const token = sessionStorage.getItem("token");
      const resp = await fetch(
        backendIP + "/" + props.uuid + "/get_trustees",
        {
          method: "GET",
          headers: {
            "x-access-tokens": token,
            "Content-Type": "application/json",
          },
        }
      );

      const jsonResponse = await resp.json();
      setTrustees(jsonResponse);
    }
    getTrustees();
  }, []);

  return (
    <div className="mx-auto">
      {!trustees ? (
        <></> // TODO: Revisar condición
      ) : (
        <>
          {trustees.map((t, index) => {
            return (
              <div className="box" id="trustee-box" key={t.name}>
                <span className="has-text-weight-bold is-size-4">
                  Custodio de Clave #{index + 1}: {t.name}
                  {props.admin && (
                    <>
                      {t.public_key_hash ? (
                        <>
                          {!props.election.frozen_at && (
                            <>
                              <span> &nbsp; </span>[
                              <TextAlert
                                id="trustees-link"
                                title={"eliminar"}
                                message={
                                  "Are you sure you want to remove Helios as a trustee?"
                                }
                                action={() => {
                                  window.location.href =
                                    backendHeliosIP +
                                    "/app/elections/" +
                                    props.uuid +
                                    "/trustees/delete?uuid=" +
                                    t.uuid;
                                }}
                              />
                              ]
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <br />({t.email})<span> &nbsp; </span>
                          {!props.election.frozen_at && (
                            <>
                              [
                              <a style={{color: "rgb(0, 182, 254)"}} onClick={() => {props.deleteTrustee(t.uuid)}}>Eliminar</a>
                              ]
                            </>
                          )}
                          <span> &nbsp; </span>[
                          <TextAlert
                            id="trustees-link"
                            title={"enviar link"}
                            message={
                              "Are you sure you want to send this trustee his/her admin URL?"
                            }
                            action={() => {
                              window.location.href =
                                backendHeliosIP +
                                "/app/elections/" +
                                props.uuid +
                                "/trustees/" +
                                t.uuid +
                                "/sendurl";
                            }}
                          />
                          ]
                        </>
                      )}
                    </>
                  )}
                </span>

                {t.public_key_hash ? (
                  <p className="mt-4">
                    Código de Clave Pública: <tt>{t.public_key_hash}</tt>
                  </p>
                ) : (
                  <p className="mt-4">Custodio aún no sube su clave pública.</p>
                )}

                {props.election.encrypted_tally && (
                  <p
                    id="status-decryption-{{ forloop.counter0 }}"
                    className="has-text-weight-bold is-size-5 status-decryption is-flex is-flex-direction-column"
                  >
                    ESPERANDO DESENCRIPTACIÓN PARCIAL
                    <img
                      className="is-align-self-center loading-trustee"
                      src="{{ settings.STATIC_URL }}app/loading2.gif"
                      alt=""
                    />
                  </p>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}

export default TrusteesList;
