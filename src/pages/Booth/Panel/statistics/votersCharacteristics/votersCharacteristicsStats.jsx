import SimpleHorizontalTable from "../../../../../component/Tables/HorizontalTable"
import { isOpenLoginElection } from "../../../../../utils"
import { getDataPerGroup } from "../utils"
import { PeopleStats } from "../components/PeopleStats"

function NumOfVoters({numOfVoters}) {
  return (
    <div>
      <SimpleHorizontalTable
        contentPerRow={[{
          header: "Votantes",
          value: numOfVoters,
        }]}
      />
    </div>
  )
}

export default function VotersCharacteristicsStats({ loginType, election }) {
  const showCompleatStatistic = !isOpenLoginElection(loginType)
  
  const {
    grouped: groupedElection,
    voters_by_weight_end: votersCharString,
    total_voters: totalVoters,
  } = election

  if (!showCompleatStatistic) {
    return (
      <NumOfVoters
        numOfVoters={totalVoters}
      />
    )
  }

  const votersChar = JSON.parse(votersCharString)
  const {
    voters_by_weight_end: votersByWeight,
    voters_by_weight_end_grouped: votersByWeightPerGroup,
  } = votersChar

  const dataPerGroup = getDataPerGroup(votersByWeightPerGroup)
  return (
    <PeopleStats
      dataPerGroup={dataPerGroup}
      groupedElection={groupedElection}
      getCountTitle={
        (groupName) => groupName
        ? `Votantes en ${groupName.toLowerCase()}`
        : "Votantes"
      }
      groupsTitle="Votantes por grupo"
      gendersTitle="Géneros"
      getWeightsTitle={
        (groupName) => groupName
        ? `Ponderaciones en ${groupName.toLowerCase()}`
        : "Ponderaciones entre los votantes"
      }
    />
  )
}
