import { Dialog } from "@/components/ui/dialog"
import { z } from "zod"
import { useAuth } from "@/context/AuthContext"
import AddEditDialog from "./AddEditDialog"
import { AddEditProductValidation } from "@/lib/validation"
import { EditProductProps } from "@/types"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle } from "lucide-react"

const EditProduct = ({
  selectedProduct,
  isEditOpen,
  setIsEditOpen,
  form,
}: EditProductProps) => {
  const { session } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

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

      // Show success edit toast
      toast({
        description: (
          <div
            role="alert"
            aria-live="polite"
            aria-label="Product added successfully."
            className="flex gap-2"
          >
            <CheckCircle size={20} className="text-green-500" />
            <div>Product edited successfully.</div>
          </div>
        ),
      })

      router.refresh()
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
