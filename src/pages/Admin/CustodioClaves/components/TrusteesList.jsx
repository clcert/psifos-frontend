import { useState } from "react";
import { useEffect } from "react";
import { getTrustees } from "../../../../services/trustee";
import InfoTrustee from "./InfoTrustee";
function TrusteesList(props) {
  /** @state {array} trustees list */
  const [trustees, setTrustees] = useState([]);

  useEffect(() => {
    getTrustees(props.uuid).then((trustees) => {
      setTrustees(trustees.jsonResponse);
    });
  }, []);

  useEffect(function effectFunction() {
    let interval = setInterval(() => {
      getTrustees(props.uuid).then((trustees) => {
        setTrustees(trustees.jsonResponse);
      });
    }, 500);
    return () => {
      clearInterval(interval);
    };
  }, [trustees]);

  return (
    <div className="mx-auto">
      {trustees.map((t, index) => {
        return (
          <div className="box" id="trustee-box" key={t.name}>
            <span className="has-text-weight-bold is-size-4">
              Custodio de Clave #{index + 1}: {t.name}
              <>
                <br />({t.email})<span> &nbsp; </span>
                {props.election.election_status === "Setting up" && (
                  <a
                    style={{ color: "rgb(0, 182, 254)" }}
                    onClick={() => {
                      props.deleteTrustee(t.uuid);
                    }}
                  >
                    Eliminar
                  </a>
                )}
                <span> &nbsp; </span>
                <a style={{ color: "rgb(0, 182, 254)" }} onClick={() => {}}>
                  Enviar link
                </a>
              </>
            </span>

            {t.public_key_hash ? (
              <p className="mt-4">
                Código de Clave Pública: <tt>{t.public_key_hash}</tt>
              </p>
            ) : (
              <p className="mt-4">Custodio aún no sube su clave pública.</p>
            )}

            {props.election.encrypted_tally && <InfoTrustee trustee={t} />}
          </div>
        );
      })}
    </div>
  );
}

export default TrusteesList;
