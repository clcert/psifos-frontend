import { useState } from "react"
import Statistic from "./statistic"
import SimpleHorizontalTable from "../../../../../component/Tables/HorizontalTable"
import ClassicSelector from "../../../../../component/Selectors/classicSelector"
import {
  getVotersByGroup, getGroupNamesObj,
  getGendersObject, getWeightsObject,
} from "./utils"

function NumOfVoters({ countTitle, numOfVoters }) {
  return (
    <div>
      <SimpleHorizontalTable
        contentPerRow={[{
          header: countTitle,
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
  groupedElection, countTitle, numOfVoters,
  handleSelector, selectedGroup, selectorOptions,
}) {
  return (
    <div className="statistic-header-container">
      <NumOfVoters
        numOfVoters={numOfVoters}
        countTitle={countTitle}
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
  weightsTitle, groupsTitle, gendersTitle,
  votersPerGroup, weights, genders,
}) {
  return (
    <div>
      {votersPerGroup && <Statistic
        title={groupsTitle}
        pieChartData={votersPerGroup}
        tableData={votersPerGroup}
      />}
      <Statistic
        title={weightsTitle}
        pieChartData={weights}
        tableData={Object.fromEntries(
          Object.entries(weights).map(([key, value]) => {
            return [`Personas con ponderación ${key}`, value];
          })
        )}
      />
      {genders && <Statistic
        title={gendersTitle}
        pieChartData={genders}
        tableData={genders}
      />}
    </div>
  )
}

export function PeopleStats ({
  groupedElection, dataPerGroup,
  getCountTitle, getWeightsTitle,
  groupsTitle, gendersTitle,
  normalizeWeights, maxWeight,
}) {
  const [selectedIdGroup, setSelectedIdGroup] = useState("1")
  const inRollGroup = selectedIdGroup === "1" 

  const votersByGroup = getVotersByGroup(dataPerGroup)
  const groupNamesObj = getGroupNamesObj(Object.keys(dataPerGroup))
  const selectedGroupName = groupNamesObj[selectedIdGroup]
  const selectedGroupData = dataPerGroup[selectedGroupName]

  return (
    <div>
      <Header
        groupedElection={groupedElection}
        countTitle={getCountTitle(selectedGroupName)}
        numOfVoters={selectedGroupData.voters}
        handleSelector={setSelectedIdGroup}
        selectedGroup={selectedIdGroup}
        selectorOptions={groupNamesObj}
      />
      <Stats
        groupsTitle={groupsTitle}
        weightsTitle={
          getWeightsTitle(!inRollGroup && selectedGroupName)
        }
        gendersTitle={gendersTitle}
        votersPerGroup={
          groupedElection && inRollGroup && votersByGroup
        }
        weights={
          getWeightsObject(
            selectedGroupData.weights, normalizeWeights, maxWeight
          )
        }
        genders={
          getGendersObject(selectedGroupData.genders)
        }
      />
    </div>
  )
}