const getElectionDate = (startTime, endTime) => {
  const dateOptions = { 
    weekday: 'long',
    month: 'long',
    day: 'numeric' 
  }
  const [ dateInit, timeInit ] = startTime.split(' ');
  const [ dateEnd, timeEnd ] = endTime.split(' ');
  if (dateInit === dateEnd) {
    return new Date(dateInit).toLocaleDateString('es-ES', dateOptions) + ', de '+ timeInit + ' a ' + timeEnd + ' hrs.';
  } else {
    return ('desde ' + new Date(dateInit).toLocaleDateString('es-ES', dateOptions) + ' ' + timeInit + ' hrs.' 
      + ' hasta ' + new Date(dateEnd).toLocaleDateString('es-ES', dateOptions) + ' ' + timeEnd + ' hrs.' 
    )
  }
}

function InfoVotacion({image, electionData}) {

  const electionDate = getElectionDate(electionData.startTime, electionData.endTime);

  return (
    <div className="election-box">
      <div className="is-flex ml-0 is-justify-content-center">
        <img width={40} height={40} src={image} alt=""/>
        <p className="has-text-weight-bold is-size-4 ml-3 mt-4 current-election-title ">
          ELECCIÓN EN CURSO
        </p>
      </div>
      <div className="unit-logo">
        <img src={`/Fotos/${electionData.picture}`} alt="Logo de Unidad Académica"/>
      </div>
      <div className="election-date">
        <b>FECHA</b>:
        <p>{electionDate}</p>
      </div>
      <div className="election-detail">
        <b>ELECCIONES</b>
        <ul className="elections-list">
          {
            electionData.elections.map((election, index) => (
              <li key={index} className="is-size-6 mb-1 is-flex is-justify-content-space-between is-align-items-center">
                <span className={"election-bullet bullet-" + String((index % 2) + 1)}>
                  { " ● " }
                </span>
                <span>{ election }</span>
                <hr className={"multiple-elections-hr bullet-" + String((index % 2) + 1)} />
                {
                  electionData.open ?
                  <button className={"button election-button election-button-"+ String((index % 2) + 1)} >VOTAR</button>
                  :
                  <button className={"button election-button election-button-"+ String((index % 2) + 1)} disabled>VOTAR</button>
                }
              </li>
            ))
          }
        </ul>
      </div>
      {
        !electionData.open &&
        <div className="election-closed">
          <p className="has-text-weight-bold is-size-6">ELECCIÓN CERRADA</p>
        </div> 
      }
    </div>
  );
}

export default InfoVotacion;
