import { CardStatsProps } from "@/types"
import { ArrowUp } from "lucide-react"
import React from "react"

const Card = (props: CardStatsProps) => {
  const { label, value, growthRate } = props

  return (
    <div className="flex flex-col h-48 w-full rounded-md border p-4">
      <div className="text-muted-foreground font-medium">{label}</div>
      <div className="flex flex-col items-center gap-2 justify-center m-auto">
        <span className="text-5xl font-bold ">{value}</span>
        <span className="flex items-start text-lg text-green-500">
          <ArrowUp size={24} />
          {growthRate}%
        </span>
      </div>
      <p className="text-sm text-muted-foreground text-center">
        vs previous 30 days
      </p>
    </div>
  )
}

export default Card
