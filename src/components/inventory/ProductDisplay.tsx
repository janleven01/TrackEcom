"use client"

import { Card, CardContent, CardFooter } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import AddProduct from "./AddProduct"
import { InventoryProps } from "@/types"
import InventoryRow from "./InventoryRow"
import { useState } from "react"
import EditProduct from "./EditProduct"

const ProductDisplay = ({
  inventory,
  params,
}: {
  inventory: InventoryProps[]
  params: string
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>("")

  const handleEditToggle = (productName: string) => {
    setSelectedProduct(productName)
    setIsEditOpen((prev) => !prev)
  }

  const handleDelete = async (productName: string) => {
    const hasConfirmed = confirm(
      "Are you sure you want to delete this product?"
    )

    if (hasConfirmed) {
      try {
        await fetch(
          `${
            process.env.NEXT_PUBLIC_VERCEL_URL
          }/api/inventory/${params}?productName=${encodeURIComponent(
            productName
          )}`,
          {
            method: "DELETE",
          }
        )

        window.location.reload()
      } catch (error) {
        console.log(error)
      }
    }
  }

  return (
    <>
      <Card className="flex flex-col justify-between border-none h-full shadow-none">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">
                  Total Sales
                </TableHead>
                <TableHead className="hidden md:table-cell">
                  Created at
                </TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((product) => (
                <InventoryRow
                  productName={product.productName}
                  status={product.status}
                  price={product.price}
                  stock={product.stock}
                  createdAt={product.createdAt}
                  key={product.productName}
                  handleDelete={handleDelete}
                  handleEditToggle={handleEditToggle}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <h4>
              Showing <strong>1</strong> of <strong>1</strong> products
            </h4>
            <AddProduct />
          </div>
        </CardFooter>
      </Card>

      {isEditOpen && (
        <EditProduct
          selectedProduct={selectedProduct}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
        />
      )}
    </>
  )
}

export default ProductDisplay
