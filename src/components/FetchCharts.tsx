import FetchBarCharts from "./FetchBarChart"
import FetchStats from "./FetchStats"

const FetchCharts = async ({ params }: { params: string }) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/charts/${params}`
  )
  if (!res.ok) {
    const errorMessage = await res.text()
    console.error("Fetch error:", errorMessage)
    throw new Error(`Error: ${errorMessage || "Failed to fetch charts"}`)
  }

  const { stats, data } = await res.json()

  return (
    <div className="space-y-4">
      <FetchStats stats={stats} />
      <FetchBarCharts chartData={data} />
    </div>
  )
}

export default FetchCharts
