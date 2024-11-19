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
import { usePathname, useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle, Trash2 } from "lucide-react"
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
  const [activeCheckboxes, setActiveCheckboxes] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState<boolean>(false)

  const handleSelectAll = () => {
    if (!selectAll) {
      setActiveCheckboxes((prev) => [
        ...new Set([...prev, ...inventory.map((item) => item.productName)]),
      ])
    } else {
      setActiveCheckboxes([])
    }

    setSelectAll((prev) => !prev)
  }

  const handleCheckbox = (productName: string) => {
    if (activeCheckboxes.includes(productName)) {
      setActiveCheckboxes(
        activeCheckboxes.filter((name) => name !== productName)
      )
    } else {
      setActiveCheckboxes([...activeCheckboxes, productName])
    }
  }
  const startIndex = currentPage === 1 ? 0 : (currentPage - 1) * 6
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
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/inventory/${params}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(productName),
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

  const handleDeleteAll = async () => {
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_VERCEL_URL}/api/inventory/${params}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(activeCheckboxes),
        }
      )

      // Show success toast
      toast({
        description: (
          <div className="flex gap-2">
            <CheckCircle size={20} className="text-green-500" />
            {activeCheckboxes.length > 1 ? (
              <div>
                {activeCheckboxes.length} products deleted successfully.
              </div>
            ) : (
              <div>Product deleted successfully.</div>
            )}
          </div>
        ),
      })

      router.refresh()
      setActiveCheckboxes([])
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
              <TableRow className="hover:bg-white">
                <TableHead className="relative w-16">
                  <input
                    type="checkbox"
                    checked={
                      activeCheckboxes.length >= inventory.length &&
                      activeCheckboxes.includes(inventory[0].productName)
                    }
                    onChange={handleSelectAll}
                    className="cursor-pointer"
                  />
                  {activeCheckboxes.length > 0 && (
                    <div className="group">
                      <button
                        type="button"
                        className="rounded-full p-2 group-hover:bg-slate-200 absolute -right-1 top-1.5"
                        onClick={handleDeleteAll}
                      >
                        <Trash2 size={16} />
                      </button>
                      <div className="hidden group-hover:block text-xs px-2 rounded-md py-1 bg-slate-700 text-slate-200 absolute -bottom-4 -right-4">
                        Delete
                      </div>
                    </div>
                  )}
                </TableHead>
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
                  activeCheckboxes={activeCheckboxes}
                  handleDelete={handleDelete}
                  handleEditToggle={handleEditToggle}
                  handleToggle={handleToggle}
                  handleCheckbox={handleCheckbox}
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
                {startIndex + 1} - {startIndex + inventory.length}
              </strong>{" "}
              of <strong>{totalItems}</strong> products
            </span>
            {totalPages > 1 && (
              <div className="max-lg:order-3 max-lg:w-full lg:flex-wrap">
                <PaginationUI
                  currentPage={currentPage}
                  totalPages={totalPages}
                  setSelectAll={setSelectAll}
                />
              </div>
            )}
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
