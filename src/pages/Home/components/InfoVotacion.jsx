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
    <section className="section">
      <div className="election-box">
        <div className="is-flex ml-0 is-justify-content-center">
          <img width={40} height={40} src={image} alt=""/>
          <p className="has-text-weight-bold is-size-4 ml-3 mt-4 current-election-title ">
            ELECCIÓN EN CURSO
          </p>
        </div>
        <div className="unit-logo">
          <img width={250} src={`/Fotos/${electionData.picture}`} alt="Logo de Unidad Académica"/>
        </div>
        <div className="election-date">
          <b>FECHA</b>: {electionDate}
        </div>
        <div className="election-detail">
          <b>ELECCIONES</b>
          <ul>
            {
              electionData.elections.map((election, index) => (
                <li key={index} className="is-size-6 mb-1 is-flex is-justify-content-space-between is-align-items-center">
                  <span>{ election }</span>
                  <hr className="multiple-elections-hr" />
                  <a href="/#" className="button is-primary is-small">Votar</a>
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </section>
  );
}

export default InfoVotacion;
