const getElectionDate = (startTime, endTime) => {
  const dateOptions = { 
    weekday: 'long',
    month: 'long',
    day: 'numeric' 
  }
  const [ dateInit, timeInit ] = startTime.split(' ');
  const [ dateEnd, timeEnd ] = endTime.split(' ');
  if (dateInit === dateEnd) {
    return new Date(dateInit + " 00:00").toLocaleDateString('es-ES', dateOptions) + ', de '+ timeInit + ' a ' + timeEnd + ' hrs.';
  } else {
    return ('desde ' + new Date(dateInit + " 00:00").toLocaleDateString('es-ES', dateOptions) + ' ' + timeInit + ' hrs.' 
      + ' hasta ' + new Date(dateEnd + " 00:00").toLocaleDateString('es-ES', dateOptions) + ' ' + timeEnd + ' hrs.' 
    )
  }
}

function InfoVotacion({image, electionData}) {

  const electionDate = getElectionDate(electionData.startTime, electionData.endTime);

  return (
    <div className="election-box">
      <div className="is-flex ml-0">
        <img width={40} height={40} src={image} alt=""/>
        <p className="has-text-weight-bold is-size-4 ml-3 mt-4 current-election-title ">
          ELECCIÓN EN CURSO
        </p>
      </div>
      <div className="unit-logo">
        <img src={`/Fotos/${electionData.picture}`} alt="Logo de Unidad Académica"/>
      </div>
      <div className="mt-3">
        <b>FECHA</b>
        <p style={{ "font-size": "16px" }}>{electionDate}</p>
      </div>
      <div className="election-detail">
        <b>ELECCIONES</b>
        <ul className="elections-list pl-0">
          {
            electionData.elections.map((election, index) => (
              <li key={index} className="is-size-6 mb-1 is-flex is-justify-content-space-between is-align-items-center">
                <span className={"election-bullet is-hidden-mobile bullet-" + String((index % 2) + 1)}>
                  { " ● " }
                </span>
                <span style={{ "font-size": "16px", "textAlign": "center" }}>{ election.name }</span>
                <hr className={"multiple-elections-hr is-hidden-mobile ml-2 bullet-" + String((index % 2) + 1)} />
                {
                  electionData.open ?
                  <a href={ election.link } target="_blank" style={{ "textDecoration": "none" }}>
                    <button className={"button election-button election-button-1"} >VOTAR</button>
                  </a>
                  :
                  <button className={"button election-button election-button-1"} disabled>VOTAR</button>
                }
              </li>
            ))
          }
        </ul>
      </div>
      {
        !electionData.open &&
        <div className="election-closed">
          <p className="has-text-weight-bold is-size-5 mb-0">ELECCIÓN CERRADA</p>
        </div> 
      }
    </div>
  );
}

export default InfoVotacion;
