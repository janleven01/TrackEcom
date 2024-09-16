import AddProduct from "./AddProduct"
import ProductDisplay from "./ProductDisplay"

const Inventory = async ({ params }: { params: string }) => {
  const res = await fetch(
    `${process.env.NEXTAUTH_URL}/api/inventory/${params}`,
    {
      cache: "no-store",
    }
  )
  if (!res.ok) {
    const errorMessage = await res.text()
    console.error("Fetch error:", errorMessage)
    throw new Error(`Error: ${errorMessage || "Failed to fetch inventory"}`)
  }

  const { inventory } = await res.json()
  return (
    <div className="flex border border-dashed rounded-lg h-[75vh] my-4">
      {inventory.length > 0 ? (
        <div className="w-full">
          <ProductDisplay inventory={inventory} params={params} />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center m-auto gap-4">
          <h3 className="font-bold text-2xl">You have no products</h3>
          <AddProduct />
        </div>
      )}
    </div>
  )
}

export default Inventory
