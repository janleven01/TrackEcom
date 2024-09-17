import React from "react"
import { Skeleton } from "../ui/skeleton"

const InventorySkeleton = () => {
  return (
    <div className="flex flex-col items-center space-y-4 w-full my-4 mx-10">
      <Skeleton className="w-full h-8" />
      <Skeleton className="w-full h-14" />
      <Skeleton className="w-full h-14 bg-gray-200" />
      <Skeleton className="w-full h-14 bg-gray-100" />
      <Skeleton className="w-full h-14 bg-gray-50" />
    </div>
  )
}

export default InventorySkeleton
