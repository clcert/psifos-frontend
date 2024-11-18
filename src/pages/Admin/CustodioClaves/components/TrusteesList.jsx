import { useCallback, useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { getTrustees } from "../../../../services/trustee";
import InfoTrustee from "./InfoTrustee";
import { electionStatus } from "../../../../constants";
import { searchTrusteeCrypto } from "../../../../utils/utils";

function TrusteesList(props) {
  /** @state {array} trustees list */
  const [trustees, setTrustees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { shortName } = useParams();

  const initComponent = useCallback(() => {
    getTrustees(shortName).then((trustees) => {
      setIsLoading(false);
      setTrustees(trustees.jsonResponse);
    });
  }, [shortName]);

  useEffect(() => {
    initComponent();
  }, [initComponent]);

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
        const trustee_crypto = searchTrusteeCrypto(t, props.election.id);
        return (
          <div className="box border-style-box" key={t.name}>
            <div className="level mb-0">
              <span className="has-text-weight-bold is-size-4 level-item">
                Custodio de Clave #{index + 1}
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

            <p className="mt-0">
              <span className="has-text-weight-bold is-size-4">{t.name}</span>
              <br />
              <tt>
                {t.trustee_login_id}
                <br />
                {t.email}
              </tt>
            </p>

            {trustee_crypto && trustee_crypto.public_key_hash ? (
              <div className="mt-4">
                Código de Clave Pública:{" "}
                <p className="overflow-auto">
                  <tt>{trustee_crypto.public_key_hash}</tt>
                </p>
              </div>
            ) : (
              <p className="mt-4">Custodio aún no sube su clave pública</p>
            )}

            {(props.election.election_status === electionStatus.tallyComputed ||
              props.election.election_status ===
                electionStatus.decryptionsUploaded ||
              props.election.election_status ===
                electionStatus.decryptionsCombined ||
              props.election.election_status ===
                electionStatus.resultsReleased) && <InfoTrustee trustee={t} />}
          </div>
        );
      })}
    </div>
  );
}

export default TrusteesList;
