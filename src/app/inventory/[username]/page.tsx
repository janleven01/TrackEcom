import Inventory from "@/components/inventory/Inventory"
import Nav from "@/components/Nav"
import InventorySkeleton from "@/components/skeleton/inventory-table"
import { authOptions } from "@/utils/authOptions"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { Suspense } from "react"

const InventoryPage = async ({ params }: { params: { username: string } }) => {
  const session = await getServerSession(authOptions)
  const decodeParams = decodeURIComponent(params.username)

  // Check if the user is authenticated and authorized
  if (!session || session.user.name !== decodeParams) redirect("/login")

  return (
    <main className="container w-full">
      <Nav />
      <section className="sm:px-6 sm:py-6 p-4 border-x border-b rounded-b-lg mb-2">
        <h1 className="text-3xl font-bold">Inventory</h1>
        <div className="flex border border-dashed rounded-lg min-h-[75vh] my-4">
          <Suspense fallback={<InventorySkeleton />}>
            <Inventory params={params.username} />
          </Suspense>
        </div>
      </section>
    </main>
  )
}

export default InventoryPage
