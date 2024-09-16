import React from "react"
import BarGraph from "./charts/interactive"
import { ChartDataProps } from "@/types"

const FetchBarCharts = ({ chartData }: { chartData: ChartDataProps[] }) => {
  return (
    <div className="w-full space-y-6">
      <BarGraph chartData={chartData} />
    </div>
  )
}

export default FetchBarCharts
