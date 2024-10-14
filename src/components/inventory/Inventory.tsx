import AddProduct from "./AddProduct"
import ProductDisplay from "./ProductDisplay"

const Inventory = async ({
  params,
  page,
}: {
  params: string
  page: string | undefined | string[]
}) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/inventory/${params}?page=${
      page ? page : 1
    }`
  )
  if (!res.ok) {
    throw new Error(`HTTP error! status: ${res.status}`)
  }

  const { inventory, currentPage, totalPages, totalItems } = await res.json()

  return (
    <>
      {totalPages > 0 ? (
        <div className="w-full">
          <ProductDisplay
            inventory={inventory}
            params={params}
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center m-auto gap-4">
          <h3 className="font-bold text-2xl">You have no products</h3>
          <AddProduct />
        </div>
      )}
    </>
  )
}

export default Inventory
