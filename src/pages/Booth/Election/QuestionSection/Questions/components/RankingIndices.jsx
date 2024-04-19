export default function RankingIndices({ indices }) {
    return (
      <div>
        {indices.map((id) => (
          <div className="ranking__idx ranked" key={id}>
            {id}°
          </div>
        ))}
      </div>
    )
}