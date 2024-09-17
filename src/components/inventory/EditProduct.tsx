import { Dialog } from "@/components/ui/dialog"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import AddEditDialog from "./AddEditDialog"
import { AddEditProductValidation } from "@/lib/validation"
import { EditProductProps } from "@/types"

const EditProduct = ({
  selectedProduct,
  isEditOpen,
  setIsEditOpen,
  form,
}: EditProductProps) => {
  const { session } = useAuth()

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
