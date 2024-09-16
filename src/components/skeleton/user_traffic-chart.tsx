import React from "react"
import { Skeleton } from "../ui/skeleton"

const UserTrafficSkeleton = () => {
  return (
    <div className="flex flex-col space-y-3 w-full ">
      <div className="space-y-2 ">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-24 w-full " />
          <div className="flex gap-2 ">
            <Skeleton className="h-24 w-[150px]" />
            <Skeleton className="h-24 w-[150px]" />
          </div>
        </div>
        <Skeleton className="min-h-[300px] w-full rounded-xl" />
      </div>
    </div>
  )
}

export default UserTrafficSkeleton
