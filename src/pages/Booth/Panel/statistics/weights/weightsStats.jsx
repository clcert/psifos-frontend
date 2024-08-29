import VotersCharacteristics from "../votersCharacteristics/votersCharacteristics"
import RollCharacteristics from "../rollCharacteristics/rollCharacteristics"

export default function WeightsStats({ election }) {
    return (
        <div>
            <VotersCharacteristics
                election={election}
            />
            <RollCharacteristics
                election={election}
            />
        </div>
    )
}