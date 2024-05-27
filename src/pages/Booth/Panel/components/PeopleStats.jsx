import Statistic from "../statistics/components/statistic"

export function WeightStats({ peopleByWeight }) {
    return (
      <Statistic
          title="Ponderaciones"
          pieChartData={peopleByWeight}
          tableData={
            {
              "Personas con ponderación 1": peopleByWeight['1'],
              "Personas con ponderación 1/2": peopleByWeight['1/2'],
              "Personas con ponderación 1/8": peopleByWeight['1/8'],
            }}
      />
    )
}

export function GenderStats({ peopleByGender }) {
    return (
      <Statistic
        title="Género"
        pieChartData={peopleByGender}
        tableData={peopleByGender}
      />
    )
}

export function JobsStats({ peopleByJob }) {
    return (
      <Statistic
        title="Rol"
        pieChartData={peopleByJob}
        tableData={peopleByJob}
      />
    )
}