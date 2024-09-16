"use client"

import { Dialog } from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import AddEditDialog from "./AddEditDialog"
import { AddEditProductValidation } from "@/lib/validation"

const AddProduct = () => {
  const { session } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const form = useForm<z.infer<typeof AddEditProductValidation>>({
    resolver: zodResolver(AddEditProductValidation),
    defaultValues: {
      productName: "",
    },
  })

  const onSubmit = async (values: z.infer<typeof AddEditProductValidation>) => {
    try {
      const res = await fetch(`/api/inventory/${session?.user.name}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })

      if (!res.ok) {
        const errorData = await res.json()
        form.setError("productName", {
          message: errorData.message || "An error occurred",
        })
        return
      }

      // Reset form fields
      form.reset()
      setDialogOpen(false)

      window.location.reload()
    } catch (error) {
      form.setError("status", { message: "Product already exist" })
    }
  }

  return (
    <section>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <AddEditDialog onSubmit={onSubmit} form={form} title="Add" />
      </Dialog>
    </section>
  )
}

export default AddProduct
