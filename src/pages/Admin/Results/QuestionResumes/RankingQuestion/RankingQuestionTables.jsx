import SimpleHorizontalTable from "../../../../../component/Tables/HorizontalTable"

function WinnerList({ winners }) {
    return (
      <div>
        {winners.map((winner) => {
          return (
            <div className="is-size-7" key={winner}>
              - {winner}
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
          header: "Algoritmo de conteo",
          value: "STV",
        }, {
          header: "Número de candidatos",
          value: ncandidates,
        }, {
          header: "Escaños disponibles",
          value: nwinners,
        }, {
          header: "Cuota",
          value: quota || 0,
        }, {
          header: "Número de rondas",
          value: nrounds,
        },
    ]
}

const getResultsTableElements = (
    winners, includeInformals, nullvotes, blankvotes
) => {
    let resultsTable = [{
        header: "Conjunto seleccionado",
        value: <WinnerList winners={winners} />,
        },
    ]

    if (includeInformals) {
        resultsTable = [
        {
            header: "Votos nulos",
            value: nullvotes,
        }, {
            header: "Votos blancos",
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
        <div className="disable-text-selection row justify-content-md-center">
            <div className="ranking-results-table">
            <SimpleHorizontalTable contentPerRow={algorithmTable}/>
            </div>
            <div className="ranking-results-table">
            <SimpleHorizontalTable contentPerRow={resultsTable}/>
            </div>
        </div>
    )
}