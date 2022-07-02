import { useState } from "react";
import { useEffect } from "react";
import { backendIP, backendHeliosIP } from "../../../../server";
import TextAlert from "../../../../component/Alerts/TextAlert";
import { getTrustees } from "../../../../services/trustee";
import InfoTrustee from "./InfoTrustee";
function TrusteesList(props) {
  /** @state {array} trustees list */
  const [trustees, setTrustees] = useState([]);

  useEffect(function effectFunction() {
    getTrustees(props.uuid).then((trustees) => {
      setTrustees(trustees.jsonResponse);
    });
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
                  <>
                    {t.public_key_hash ? (
                      <>
                        {!props.election.voting_started_at && (
                          <>
                            <span> &nbsp; </span>[
                            <a
                              style={{ color: "rgb(0, 182, 254)" }}
                              onClick={() => {
                                props.deleteTrustee(t.uuid);
                              }}
                            >
                              Eliminar
                            </a>
                            ]
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <br />({t.email})<span> &nbsp; </span>
                        {!props.election.voting_started_at && (
                          <>
                            [
                            <a
                              style={{ color: "rgb(0, 182, 254)" }}
                              onClick={() => {
                                props.deleteTrustee(t.uuid);
                              }}
                            >
                              Eliminar
                            </a>
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
                </span>

                {t.public_key_hash ? (
                  <p className="mt-4">
                    Código de Clave Pública: <tt>{t.public_key_hash}</tt>
                  </p>
                ) : (
                  <p className="mt-4">Custodio aún no sube su clave pública.</p>
                )}

                {props.election.encrypted_tally && (
                  <InfoTrustee trustee={t}/>
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
