"use client"

import { Dialog } from "@/components/ui/dialog"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import { useState } from "react"
import AddEditDialog from "./AddEditDialog"
import { AddEditProductValidation } from "@/lib/validation"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { CheckCircle } from "lucide-react"

const AddProduct = () => {
  const { session } = useAuth()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof AddEditProductValidation>>({
    resolver: zodResolver(AddEditProductValidation),
    defaultValues: {
      productName: "",
      productPrice: "" as unknown as number,
      status: "Active",
      stock: "" as unknown as number,
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

      // Show add success toast
      toast({
        description: (
          <div
            role="alert"
            aria-live="polite"
            aria-label="Product added successfully."
            className="flex gap-2"
          >
            <CheckCircle size={20} className="text-green-500" />
            <div>Product added successfully.</div>
          </div>
        ),
      })

      router.refresh()
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
