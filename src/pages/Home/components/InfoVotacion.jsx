function InfoVotacion({ image, electionData }) {
  return (
    <div className="election-box">
      <div className="is-flex ml-0">
        <img width={40} height={40} src={image} alt="" />
        <p className="has-text-weight-bold is-size-4 ml-3 mt-4 current-election-title ">
          ELECCIÓN EN CURSO
        </p>
      </div>
      <div className="unit-logo">
        <img
          src={`/Fotos/${electionData.picture}`}
          alt="Logo de Unidad Académica"
        />
      </div>
      <div className="election-title">
        <p
          className="has-text-weight-bold is-size-5 mb-0"
          style={{ "font-size": "16px" }}
        >
          {electionData.title}
        </p>
      </div>
      <div className="mt-3">
        <b>FECHA</b>
        <p style={{ "font-size": "16px" }}>
          <em>Hospital Clínico:</em> desde martes 13 de junio 09:00, hasta
          miércoles 14 de junio 17:00
          <br />
          <em>Resto de la Universidad:</em> miércoles 14 de junio, de 09:00 a
          17:00
        </p>
      </div>
      <div className="election-detail">
        <b>INGRESO POR ESTAMENTO</b>
        <ul className="elections-list pl-0">
          {electionData.elections.map((election, index) => (
            <li
              key={index}
              className="is-size-6 mb-1 is-flex is-justify-content-space-between is-align-items-center"
            >
              <span
                className={
                  "election-bullet is-hidden-mobile bienestar-bullet-" +
                  String((index % 2) + 1)
                }
              >
                {" ● "}
              </span>
              <span style={{ "font-size": "16px", textAlign: "center" }}>
                {election.name}
              </span>
              <hr
                className={
                  "multiple-elections-hr is-hidden-mobile ml-2 bienestar-bullet-" +
                  String((index % 2) + 1)
                }
              />
              {electionData.open ? (
                <a
                  href={election.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <button
                    className={
                      "button election-button bienestar-button-" +
                      String((index % 2) + 1)
                    }
                  >
                    ENTRAR
                  </button>
                </a>
              ) : (
                <button
                  className={
                    "button election-button bienestar-button-" +
                    String((index % 2) + 1)
                  }
                  disabled
                >
                  ENTRAR
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
      {!electionData.open && (
        <div className="election-closed">
          <p className="has-text-weight-bold is-size-5 mb-0">
            ELECCIÓN CERRADA
          </p>
        </div>
      )}
    </div>
  );
}

export default InfoVotacion;
