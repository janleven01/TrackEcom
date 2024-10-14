import { connectToDB } from "@/lib/database"
import { NextRequest, NextResponse } from "next/server"
import ChartData from "@/lib/models/charts"

const getDaysAgo = (days: number) => {
  const date = new Date()
  date.setDate(date.getDate() - days)
  return date.toISOString().split("T")[0]
}

const generateRandomBarChartData = () => {
  return Array.from({ length: 30 }, (_, index) => ({
    date: getDaysAgo(index),
    desktop: Math.floor(Math.random() * 100),
    mobile: Math.floor(Math.random() * 100),
  })).reverse()
}

// Function to generate random statistic data
const generateRandomStatData = () => {
  return [
    {
      label: "Total Accounts",
      value: Math.floor(Math.random() * 5000 + 1000), // Random between 1000 and 6000
      growthRate: Math.floor(Math.random() * 30 + 5),
    },
    {
      label: "Orders per Month",
      value: Math.floor(Math.random() * 400 + 100),
      growthRate: Math.floor(Math.random() * 20 + 10),
    },
    {
      label: "Average Contract",
      value: Math.floor(Math.random() * 10000 + 3000),
      growthRate: Math.floor(Math.random() * 25 + 5),
    },
    {
      label: "Growth Rate",
      value: Math.floor(Math.random() * 50 + 20),
      growthRate: Math.floor(Math.random() * 10 + 1),
    },
  ]
}

export async function GET(
  req: NextRequest,
  { params }: { params: { username: string } }
) {
  try {
    if (!params.username) {
      return NextResponse.json({ message: "Missing username" }, { status: 400 })
    }

    await connectToDB()

    const userChartData = await ChartData.findOne({
      username: params.username,
    })

    // If no chart data exists, generate random data and save it
    if (!userChartData) {
      const randomBarChartData = generateRandomBarChartData()
      const randomStats = generateRandomStatData()
      // Create and save new chart data for the user
      const newChartData = new ChartData({
        username: params.username,
        data: randomBarChartData,
        stats: randomStats,
      })

      await newChartData.save()

      return NextResponse.json({
        message: "No chart data found. Generated random data.",
        data: randomBarChartData,
        stats: randomStats,
      })
    }

    return NextResponse.json({
      data: userChartData.data,
      stats: userChartData.stats,
    })
  } catch (error) {
    console.error("Error fetching chart data:", error)
    return NextResponse.json(
      { message: "Failed to retrieve chart data" },
      { status: 500 }
    )
  }
}
