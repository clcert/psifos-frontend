import { useState } from "react"
import { WeightStats, GenderStats, GroupStats } from "../../components/PeopleStats"
import SimpleHorizontalTable from "../../../../../component/Tables/HorizontalTable"
import ClassicSelector from "../../../../../component/Selectors/classicSelector"
import {
  getGroupNamesObj, getDataPerGroup, getVotersByGroup,
} from "../utils"

function NumOfVoters({ groupName, numOfVoters }) {
  return (
    <div>
      <SimpleHorizontalTable
        contentPerRow={[{
          header: `Personas en ${groupName.toLowerCase()}`,
          value: numOfVoters,
        }]}
      />
    </div>
  )
}

function Selector({
  handleChange, selectedValue, options,
}) {
  return (
    <div style={{margin: '1rem 0'}}>
      <ClassicSelector
          handleChange={handleChange}
          options={options}
          value={selectedValue}
          selectorName="roll-group"
      />
    </div>
  )
}

function Header({
  groupedElection, totalVoters,
  handleSelector, selectedGroup, selectorOptions,
}) {
  return (
    <div className="statistic-header-container">
      <NumOfVoters
        groupName={selectorOptions[selectedGroup]}
        numOfVoters={totalVoters}
      />
      {groupedElection && <Selector
        handleChange={handleSelector}
        selectedValue={selectedGroup}
        options={selectorOptions}
      />}
    </div>
  )
}

function Stats({
  votersByWeight, votersByGender, votersByGroup, groupName,
}) {
  console.log('votersByGroup', votersByGroup)
  return (
    <div>
      {votersByGroup && <GroupStats
        peopleByJob={votersByGroup}
      />}
      <WeightStats
        peopleByWeight={{
          '1': votersByWeight['8.0'] || 0,
          '1/2': votersByWeight['4.0'] || 0,
          '1/8': votersByWeight['1.0'] || 0,
        }}
        groupName={groupName}
      />
      {votersByGender && <GenderStats
        peopleByGender={{
          'Hombre': votersByGender['men'],
          'Mujer': votersByGender['women'],
          'Otro': votersByGender['other'],
        }}
      />}
    </div>
  )
}

function FullStats ({
  groupedElection, dataPerGroup
}) {
  const [selectedIdGroup, setSelectedIdGroup] = useState("1")
  const showingRollGroup = selectedIdGroup === "1" 

  // Contains the roll group
  const votersByGroup = getVotersByGroup(dataPerGroup)
  const groupNamesObj = getGroupNamesObj(Object.keys(dataPerGroup))
  const selectedGroupName = groupNamesObj[selectedIdGroup]
  const selectedGroupData = dataPerGroup[selectedGroupName]

  return (
    <div>
      <Header
        groupedElection={groupedElection}
        totalVoters={selectedGroupData.voters}
        handleSelector={setSelectedIdGroup}
        selectedGroup={selectedIdGroup}
        selectorOptions={groupNamesObj}
      />
      <Stats
        votersByWeight={selectedGroupData.weights}
        votersByGender={false}
        votersByGroup={
          groupedElection && showingRollGroup && (
            Object.fromEntries(
              Object.entries(votersByGroup).slice(1)
            )
          )
        }
        groupName={!showingRollGroup && selectedGroupName}
      />
    </div>
  )
}

export default function RollCharacteristicsStats({ election }) {
  const {
    grouped: groupedElection,
    voters_by_weight_init: votersCharString,
    total_voters: totalVoters,
  } = election

  const votersChar = JSON.parse(votersCharString)
  const {
    voters_by_weight_init: votersByWeightInit,
    voters_by_weight_init_grouped: votersByWeightPerGroup,
  } = votersChar

  const dataPerGroup = getDataPerGroup(votersByWeightPerGroup)
  return(
    <FullStats
      dataPerGroup={dataPerGroup}
      groupedElection={groupedElection}
    />
  )
}
