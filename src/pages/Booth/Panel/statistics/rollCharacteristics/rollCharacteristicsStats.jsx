import { useState } from "react"
import { WeightStats, GenderStats, JobsStats } from "../../components/PeopleStats"
import SimpleHorizontalTable from "../../../../../component/Tables/HorizontalTable"
import ClassicSelector from "../../../../../component/Selectors/classicSelector"

const getGroupNames = (votersByWeightPerGroup) => votersByWeightPerGroup.reduce(
  (acc, groupData, id) => {
    return {
      ...acc, [id]: groupData.group
    }
  }, {}
)

function NumOfVoters({numOfVoters}) {
  return (
    <div>
      <SimpleHorizontalTable
        contentPerRow={[{
          header: "Personas en el padrón",
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
  grouped, totalVoters,
  handleSelector, selectedGroup, selectorOptions,
}) {
  return (
    <div className="statistic-header-container">
      <NumOfVoters
        numOfVoters={totalVoters}
      />
      {/*grouped && <Selector
        handleChange={handleSelector}
        selectedValue={selectedGroup}
        options={selectorOptions}
      */}
    </div>
  )
}

function Stats({
  votersByWeight, votersByGender, votersByJob,
}) {
  return (
    <div>
      <WeightStats
        peopleByWeight={{
          '1': votersByWeight['8.0'] || 0,
          '1/2': votersByWeight['4.0'] || 0,
          '1/8': votersByWeight['1.0'] || 0,
        }}
      />
      {votersByGender && <GenderStats
        peopleByGender={{
          'Hombre': votersByGender['men'],
          'Mujer': votersByGender['women'],
          'Otro': votersByGender['other'],
        }}
      />}
      {votersByJob && <JobsStats
        peopleByJob={{
          'Estudiantes': votersByJob['student'],
          'Funcionarios': votersByJob['worker'],
          'Académicos': votersByJob['professor'],
        }}
      />} 
    </div>
  )
}

export default function RollCharacteristicsStats({ election }) {
  const [selectedGroup, setSelectedGroup] = useState("1")
  const {
    grouped,
    voters_by_weight_init: votersCharString,
    total_voters: totalVoters,
  } = election

  const votersChar = JSON.parse(votersCharString)
  const {
    voters_by_weight_init: votersByWeight,
    voters_by_weight_init_grouped: votersByWeightPerGroup,
  } = votersChar
  return(
    <div>
      <Header
        grouped={grouped}
        totalVoters={totalVoters}
        handleSelector={setSelectedGroup}
        selectedGroup={selectedGroup}
        selectorOptions={getGroupNames(votersByWeightPerGroup)}
      />
      <Stats
        votersByWeight={votersByWeight}
        election={election}
        votersByGender={false}
        votersByJob={false}
      />
    </div>
  )
}
