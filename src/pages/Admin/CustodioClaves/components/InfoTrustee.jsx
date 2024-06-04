function InfoTrustee({trustee_crypto}) {
  return (
    <div>
      {trustee_crypto.decryptions ? (
        <p
          id="decryption-finish"
          className="has-text-weight-bold is-size-5 status-decryption is-flex is-flex-direction-column"
        >
          DESENCRIPTACIÓN PARCIAL RECIBIDA
        </p>
      ) : (
        <p
          id={
            trustee_crypto.decryptions ? "decryption-finish" : "decryption-wait"
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
