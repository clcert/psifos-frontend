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
      {trustees.length > 0 && (
        <div className="has-text-centered title is-size-4-mobile my-3">
          Lista de custodios
        </div>
      )}
      {trustees.map((t, index) => {
        return (
          <div className="box border-style-box" key={t.name}>
            <div className="level">
              <span className="has-text-weight-bold is-size-4 level-item">
                Custodio de Clave #{index + 1}: {t.name}
              </span>
              {props.election.election_status === "Setting up" && (
                <span className="level-right">
                  <i
                    className="close-question fa-solid fa-trash"
                    onClick={() => {
                      props.deleteTrustee(t.uuid);
                    }}
                  />
                </span>
              )}
            </div>

            {t.public_key_hash ? (
              <p className="mt-4">
                Código de Clave Pública:{" "}
                <p className="overflow-auto">
                  <tt>{t.public_key_hash}</tt>
                </p>
              </p>
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
