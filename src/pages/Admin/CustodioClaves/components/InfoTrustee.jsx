import { getDecryption } from "../../../../services/trustee";
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";

function InfoTrustee({ trustee }) {
  const [decryption, setDecryption] = useState([]);

  const { shortName } = useParams();

  const initComponent = useCallback(() => {
    getDecryption(shortName, trustee.uuid).then((decryption) => {
      setDecryption(decryption.jsonResponse);
    });
  }, [shortName, trustee.uuid]);

  useEffect(() => {
    initComponent();
  }
  , [initComponent]);

  useEffect(
    function effectFunction() {
      let interval = setInterval(() => {
        getDecryption(shortName, trustee.uuid).then((decryption) => {
          setDecryption(decryption.jsonResponse);
        });
      }, 5000);
      return () => {
        clearInterval(interval);
      };
    },
    [decryption, shortName]
  );

  const hasDecryption = decryption && decryption.length > 0;

  return (
    <div>
      {hasDecryption ? (
        <p
          id="decryption-finish"
          className="has-text-weight-bold is-size-5 status-decryption is-flex is-flex-direction-column"
        >
          DESENCRIPTACIÓN PARCIAL RECIBIDA
        </p>
      ) : (
        <p
          id={
            hasDecryption ? "decryption-finish" : "decryption-wait"
          }
          className="has-text-weight-bold is-size-5 status-decryption is-flex is-flex-direction-column"
        >
          ESPERANDO DESENCRIPTACIÓN PARCIAL
        </p>
      )}
    </div>
  );
}

export default InfoTrustee;
