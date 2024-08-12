import { getDataPerGroup } from "../utils"
import { PeopleStats } from "../components/PeopleStats"


export default function RollCharacteristicsStats({ election }) {
  const {
    grouped: groupedElection,
    voters_by_weight_init: votersCharString,
    normalization: normalizeWeights,
    max_weight: maxWeight,
  } = election

  const votersChar = JSON.parse(votersCharString)
  const {
    voters_by_weight_init: votersByWeightInit,
    voters_by_weight_init_grouped: votersByWeightPerGroup,
  } = votersChar

  const dataPerGroup = getDataPerGroup(votersByWeightPerGroup)
  return(
    <PeopleStats
      dataPerGroup={dataPerGroup}
      groupedElection={groupedElection}
      getCountTitle={
        (groupName) => groupName
        ? `Personas en ${groupName.toLowerCase()}`
        : "Personas en el padrón"
      }
      groupsTitle="Personas por grupo"
      gendersTitle="Géneros"
      getWeightsTitle={
        (groupName) => groupName
        ? `Ponderaciones en ${groupName.toLowerCase()}`
        : "Ponderaciones en el padrón"
      }
      normalizeWeights={normalizeWeights}
      maxWeight={maxWeight}
    />
  )
}
