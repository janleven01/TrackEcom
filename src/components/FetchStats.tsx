import { CardStatsProps } from "@/types"
import Card from "./charts/Card"

const FetchStats = async ({ stats }: { stats: CardStatsProps[] }) => {
  return (
    <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
      {stats.map((chart: CardStatsProps) => (
        <div key={chart.label}>
          <Card
            label={chart.label}
            value={chart.value}
            growthRate={chart.growthRate}
          />
        </div>
      ))}
    </div>
  )
}

export default FetchStats
