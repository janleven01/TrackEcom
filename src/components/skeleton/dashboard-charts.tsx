import React from "react"
import { Skeleton } from "../ui/skeleton"
import UserTrafficSkeleton from "./user_traffic-chart"

const DashboardSkeleton = () => {
  return (
    <div className="space-y-4">
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4 mt-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index}>
            <Skeleton className="h-52 w-full rounded-xl" />
          </div>
        ))}
      </div>
      <div className="w-full">
        <UserTrafficSkeleton />
      </div>
    </div>
  )
}

export default DashboardSkeleton
