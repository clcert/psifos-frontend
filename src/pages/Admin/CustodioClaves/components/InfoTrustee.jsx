function InfoTrustee(props) {
  return (
    <div>
      {props.trustee.current_step === 5 ? (
        <p
          id="decryption-finish"
          className="has-text-weight-bold is-size-5 status-decryption is-flex is-flex-direction-column"
        >
          DESENCRIPTACIÓN PARCIAL RECIBIDA
        </p>
      ) : (
        <p
          id={
            props.trustee.decryptions ? "decryption-finish" : "decryption-wait"
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
