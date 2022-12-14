import React from 'react'

const PastElection = ({election, index, colorCode='1' }) => {

  const verboseElectionDate = new Date(`${election.date} 00:00`).toLocaleDateString("es-ES", { 
    year: 'numeric',
    month: 'short',
    day: 'numeric' 
  })

  return (
    <div className={`past-election color-${colorCode}`}>
      <div>
        FECHA: { verboseElectionDate }
      </div>
      <div>
        { election.typeUnit.toUpperCase() }: { election.unit }
      </div>
      <br />
      <div>
        ELECCIONES:
        <ul>
          {
            election.elections.map((election, index) => (
              <li key={index}><p>{ election }</p></li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}

export default PastElection