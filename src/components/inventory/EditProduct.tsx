"use client"

import { Dialog } from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { useEffect, useState } from "react"
import AddEditDialog from "./AddEditDialog"
import { AddEditProductValidation } from "@/lib/validation"
import { EditProductProps } from "@/types"

const EditProduct = ({
  selectedProduct,
  isEditOpen,
  setIsEditOpen,
}: EditProductProps) => {
  const { session } = useAuth()

  const form = useForm<z.infer<typeof AddEditProductValidation>>({
    resolver: zodResolver(AddEditProductValidation),
    defaultValues: {
      productName: "",
      productPrice: 0,
      status: "Active",
      stock: 0,
    },
  })

  useEffect(() => {
    if (selectedProduct) {
      // Fetch product data by its ID
      const fetchProduct = async () => {
        const res = await fetch(
          `/api/inventory/${session?.user.name}/${encodeURIComponent(
            selectedProduct
          )}`
        )
        const product = await res.json()

        // Used the reset method to populate the form with the fetched data
        form.reset({
          productName: product.productName,
          status: product.status,
          productPrice: product.price,
          stock: product.stock,
        })
      }
      fetchProduct()
    }
  }, [selectedProduct, form, session?.user.name])

  const onSubmit = async (values: z.infer<typeof AddEditProductValidation>) => {
    try {
      const res = await fetch(
        `/api/inventory/${session?.user.name}/${encodeURIComponent(
          selectedProduct
        )}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(values),
        }
      )

      if (!res.ok) {
        const errorData = await res.json()
        form.setError("productName", {
          message: errorData.message || "An error occurred",
        })
        return
      }

      // Reset form fields
      form.reset()

      setIsEditOpen(false)
      window.location.reload()
    } catch (error) {
      form.setError("status", { message: "Product already exist" })
    }
  }

  return (
    <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
      <AddEditDialog onSubmit={onSubmit} form={form} title="Edit" />
    </Dialog>
  )
}

export default EditProduct
