import SimpleHorizontalTable from "../../../../component/Tables/HorizontalTable";
import SankeyChart from "../../component/SankeyChart";
import {
  getNodeObjectList,
  getNodeName,
  getStopNodeName,
  getCandidateFromName,
  isHopeful,
  isOutOfRace,
  createEdgeData,
} from "./RankingQuestionUtils";

const getNodesAndEdges = (results) => {
  let nodeNames = []
  let edges = []
  let outOfRaceList = []

  for (let i=0; i<results.length-1; i++) {
      const currentRound = results[i]
      const nextRound = results[i+1]

      let grownCandidates = {}
      let {outOfRaceNode, lostVotes} = {}

      Object.keys(currentRound).forEach((candidate) => {
          const { status, votes } = currentRound[candidate]
          const currentNodeName = getNodeName(candidate, i)
          const nextNodeName = getNodeName(candidate, i+1)

          if (isHopeful(status)) {
              const wonVotes = nextRound[candidate].votes - votes
              if (wonVotes > 0) {
                  grownCandidates[candidate] = wonVotes
              }
              edges.push(createEdgeData(
                  currentNodeName,
                  nextNodeName,
                  votes
              ))
              !nodeNames.includes(nextNodeName) && nodeNames.push(nextNodeName)
          }
          !nodeNames.includes(currentNodeName) && nodeNames.push(currentNodeName)
          if (isOutOfRace(status) && !outOfRaceList.includes(candidate)) {
              outOfRaceList.push(candidate)
              outOfRaceNode = getNodeName(candidate, i)
              lostVotes = votes
          }
      })

      Object.keys(grownCandidates).forEach((candidate) => {
          const votes = grownCandidates[candidate]
          edges.push(createEdgeData(
              outOfRaceNode,
              getNodeName(candidate, i+1),
              votes
          ))
          lostVotes = lostVotes - votes
      })

      if (lostVotes > 0) {
          edges.push(createEdgeData(
              outOfRaceNode,
              getStopNodeName(i+1),
              lostVotes
          ))
      }
  }
  return {
    nodes: getNodeObjectList(
      nodeNames,
      Object.keys(results[0]).length,
    ),
    edges}
}


function WinnerList({winners}) {
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

function ResumeTables() { //todo: cambiar nombre
  const algorithmTable = [
    {
      header: "Algoritmo de conteo",
      value: "STV",
    }, {
      header: "Número de candidatos",
      value: 8,
    }, {
      header: "Escaños disponibles",
      value: 4,
    }, {
      header: "Cuota",
      value: 25,
    }, {
      header: "Número de rondas",
      value: 4,
    },
  ]

  const winners = ["Opción 1", "Opción 2", "Opción 3", "Opción 4"]

  const resultsTable = [
    {
      header: "Votos nulos",
      value: 4,
    }, {
      header: "Votos blancos",
      value: 2,
    }, {
      header: "Conjunto seleccionado",
      value: <WinnerList winners={winners} />,
    },
  ]
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

export default function RankingQuestionResume({ result, question, election }) {
  const results = [
    {
        0: { // id candidato
            votes: 4,
            status: "Hopeful", 
        },
        1: {
            votes: 3,
            status: "Hopeful", 
        },
        2: {
            votes: 2,
            status: "Rejected", 
        },
    },
    {
        1: { // id candidato
            votes: 5,
            status: "Elected",
        },
        0: {
            votes: 4,
            status: "Rejected", 
        },
        2: {
            votes: 0,
            status: "Rejected", 
        },
    },
  ]
  const { nodes, edges } = getNodesAndEdges(results)
  return (
    <div style={{ marginTop: "1rem" }} className="is-size-6">
      <ResumeTables />
      {results.length > 1 && <SankeyChart
        nodes={nodes}
        edges={edges}
        labelFormatter={(params) => {
          const name = params.name;
          return name.includes('-')
          ? getCandidateFromName(name)
          : name
        }}
      />}
    </div>
  );
}