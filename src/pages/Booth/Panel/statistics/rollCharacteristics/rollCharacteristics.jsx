import { isSettingUpElection, isOpenLoginElection } from "../../../../../utils"
import ShowStatistics from "../components/showStatistics"
import RollCharacteristicsStats from "./rollCharacteristicsStats"

export default function RollCharacteristics({ election }) {
  return(
    <ShowStatistics
      notAvailableMessage={
        isSettingUpElection(election.election_status)
        ? "La elección aun no comienza"
        : "La elección tiene padrón abierto"
      }
      showNotAvailableMessage={election && (
        isSettingUpElection(election.election_status) || isOpenLoginElection(election.election_login_type))
      }
      isLoadData={Boolean(election)}
      statisticsComponent={<RollCharacteristicsStats
        election={election}
      />}
    />
  )
}