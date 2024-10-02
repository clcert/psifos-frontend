import SimpleHorizontalTable from "../../../../../component/Tables/HorizontalTable"

function WinnerList({ winners }) {
    return (
      <div>
        {winners.map((winner) => {
          return (
            <div className="is-size-5" key={winner}>
              {winner}
            </div>
          )
        })}
      </div>
    )
}

const getAlgorithmTableElements = (
    ncandidates, nwinners, quota, nrounds,
) => {
    return [
        {
          header: "Algoritmo de Conteo",
          value: "STV",
        }, {
          header: "Número de Candidatos",
          value: ncandidates,
        }, {
          header: "Escaños Disponibles",
          value: nwinners,
        }, {
          header: "Cuota",
          value: quota || 0,
        }, {
          header: "Número de Rondas",
          value: nrounds,
        },
    ]
}

const getResultsTableElements = (
    winners, includeInformals, nullvotes, blankvotes
) => {
    let resultsTable = [{
        header: "Opciones Seleccionadas",
        value: <WinnerList winners={winners} />,
        alignTextLeft: true,
      },
    ]

    if (includeInformals) {
        resultsTable = [
        {
            header: "Votos Nulos",
            value: nullvotes,
        }, {
            header: "Votos Blancos",
            value: blankvotes,
        },
        ...resultsTable
        ]
    }

    return resultsTable
}

export function ResumeTables({
    blankvotes, ncandidates, nrounds, nullvotes,
    nwinners, quota, winners, includeInformals,
}) {
    const algorithmTable = getAlgorithmTableElements(
        ncandidates, nwinners, quota, nrounds
    )
    const resultsTable = getResultsTableElements(
        winners, includeInformals, nullvotes, blankvotes
    )
    return (
        <div className="disable-text-selection ranking-results-tables-container">
            <div className="ranking-results-table">
            <SimpleHorizontalTable contentPerRow={algorithmTable}/>
            </div>
            <div className="ranking-results-table">
            <SimpleHorizontalTable contentPerRow={resultsTable}/>
            </div>
        </div>
    )
}