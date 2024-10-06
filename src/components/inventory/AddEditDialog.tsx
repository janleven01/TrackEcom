import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { SubmitHandler, UseFormReturn } from "react-hook-form"
import { z } from "zod"
import CustomFormField from "../CustomForm"
import { Form } from "../ui/form"
import { Button } from "../ui/button"
import { Box, DollarSignIcon, LoaderCircle, Package } from "lucide-react"
import { FormFieldType } from "@/types"
import { productStatus } from "@/constants"
import { SelectItem } from "../ui/select"
import { AddEditProductValidation } from "@/lib/validation"

type AddEditDialogProps = {
  onSubmit: SubmitHandler<z.infer<typeof AddEditProductValidation>>
  form: UseFormReturn<
    {
      status: "Active" | "Draft" | "Archived"
      productName: string
      productPrice: number | null
      stock: number | null
    },
    any,
    undefined
  >
  title: string
}

const AddEditDialog = ({ form, onSubmit, title }: AddEditDialogProps) => {
  return (
    <>
      <DialogTrigger asChild>
        {title === "Add" && <Button variant="default">Add Product</Button>}
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-describedby={`${title} Product`}
      >
        <DialogHeader>
          <DialogTitle>Quick Instructions</DialogTitle>
          <DialogDescription>
            To {title} a product, enter the required details and click
            &#39;Save&#39;
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="productName"
              placeholder="Product Name"
              error={form.formState.errors.productName?.message}
              Icon={<Package size={25} className="ml-2 text-slate-500" />}
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              inputType="number"
              control={form.control}
              name="productPrice"
              error={form.formState.errors.productPrice?.message}
              placeholder="Price"
              Icon={
                <DollarSignIcon size={25} className="ml-2 text-slate-500" />
              }
            />
            <CustomFormField
              fieldType={FormFieldType.INPUT}
              inputType="number"
              control={form.control}
              name="stock"
              error={form.formState.errors.stock?.message}
              placeholder="Stock"
              Icon={<Box size={25} className="ml-2 text-slate-500" />}
            />
            <CustomFormField
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="status"
              error={form.formState.errors.status?.message}
              placeholder="Select a status"
              renderOthers={productStatus.map((status) => (
                <SelectItem key={status.label} value={status.label}>
                  <h4>{status.label}</h4>
                </SelectItem>
              ))}
            />
            <DialogFooter>
              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                size={"sm"}
              >
                {form.formState.isSubmitting ? (
                  <div className="flex gap-1">
                    <p>Saving...</p>
                    <LoaderCircle
                      width={20}
                      height={20}
                      className="animate-spin"
                    />
                  </div>
                ) : (
                  <div>Save</div>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </>
  )
}

export default AddEditDialog
