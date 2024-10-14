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
import { ProductDisplayProps } from "@/types"
import InventoryRow from "./InventoryRow"
import { useState } from "react"
import EditProduct from "./EditProduct"
import { useAuth } from "@/context/AuthContext"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddEditProductValidation } from "@/lib/validation"
import { z } from "zod"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"
import { PaginationUI } from "../Pagination"
import useSWR from "swr"

// Fetcher function for SWR
const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Network response was not ok")
    return res.json()
  })

const ProductDisplay = (props: ProductDisplayProps) => {
  const { inventory, currentPage, params, totalPages, totalItems } = props

  const form = useForm<z.infer<typeof AddEditProductValidation>>({
    resolver: zodResolver(AddEditProductValidation),
    defaultValues: {
      productName: "",
      productPrice: 0,
      status: "Active",
      stock: 0,
    },
  })

  const { session } = useAuth()
  const router = useRouter()
  const { toast } = useToast()
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<string>("")

  const startIndex = (currentPage - 1) * inventory.length
  console.log((currentPage - 1) * inventory.length)
  const { data: product } = useSWR(
    selectedProduct
      ? `/api/inventory/${session?.user.name}/${encodeURIComponent(
          selectedProduct
        )}`
      : null,
    fetcher
  )

  const handleEditToggle = () => {
    setIsEditOpen((prev) => !prev)
  }

  const handleToggle = (productName: string) => {
    setSelectedProduct(productName)
    if (product) {
      form.reset({
        productName: product.productName,
        status: product.status,
        productPrice: product.price,
        stock: product.stock,
      })
    }
  }

  const handleDelete = async (productName: string) => {
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

      // Show success toast
      toast({
        description: (
          <div className="flex gap-2">
            <CheckCircle size={20} className="text-green-500" />
            <div>Product deleted successfully.</div>
          </div>
        ),
      })

      router.refresh()
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <Card className="flex flex-col justify-between border-none h-full shadow-none ">
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Price</TableHead>
                <TableHead className="hidden md:table-cell">Stocks</TableHead>
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
                  handleToggle={handleToggle}
                />
              ))}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <div className="flex gap-4 max-sm:flex-col max-lg:flex-wrap items-center justify-between w-full text-xs text-muted-foreground">
            <span className="sm:flex-none max-sm:order-2">
              Showing{" "}
              <strong>
                {startIndex + 1} to {startIndex + inventory.length}
              </strong>{" "}
              of <strong>{totalItems}</strong> products
            </span>
            <div className="max-lg:order-3 max-lg:w-full lg:flex-wrap">
              <PaginationUI currentPage={currentPage} totalPages={totalPages} />
            </div>
            <AddProduct />
          </div>
          <div></div>
        </CardFooter>
      </Card>

      {isEditOpen && (
        <EditProduct
          selectedProduct={selectedProduct}
          isEditOpen={isEditOpen}
          setIsEditOpen={setIsEditOpen}
          form={form}
        />
      )}
    </>
  )
}

export default ProductDisplay
