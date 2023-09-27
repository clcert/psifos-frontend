import { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTrustees } from "../../../../services/trustee";
import InfoTrustee from "./InfoTrustee";
function TrusteesList(props) {
  /** @state {array} trustees list */
  const [trustees, setTrustees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { shortName } = useParams();

  useEffect(() => {
    getTrustees(shortName).then((trustees) => {
      setIsLoading(false);
      setTrustees(trustees.jsonResponse);
    });
  }, [shortName, isLoading]);

  useEffect(
    function effectFunction() {
      let interval = setInterval(() => {
        getTrustees(shortName).then((trustees) => {
          setTrustees(trustees.jsonResponse);
        });
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    },
    [trustees, shortName]
  );

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center pt-4">
        <div className="spinner-animation-white"></div>
      </div>
    );
  }

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
                  <button
                    className="button-undesigned"
                    style={{ color: "rgb(0, 182, 254)" }}
                    onClick={() => {
                      props.deleteTrustee(t.uuid);
                    }}
                  >
                    Eliminar
                  </button>
                )}
              </>
            </span>

            {t.public_key_hash ? (
              <>
                <p className="mt-4">Código de Clave Pública:</p>
                <p className="overflow-auto">{t.public_key_hash}</p>
              </>
            ) : (
              <p className="mt-4">Custodio aún no sube su clave pública.</p>
            )}

            {props.election.election_status === "Tally computed" && (
              <InfoTrustee trustee={t} />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default TrusteesList;
