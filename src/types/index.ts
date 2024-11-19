import { Dispatch, SetStateAction } from "react"
import { UseFormReturn } from "react-hook-form"

export type ChartDataProps = {
  date: string
  desktop: number
  mobile: number
}

export type CardStatsProps = {
  label: string
  value: number
  growthRate: number
}

export enum FormFieldType {
  INPUT = "input",
  CHECKBOX = "checkbox",
  SELECT = "select",
}

export type InventoryProps = {
  productName: string
  status: "Active" | "Draft" | "Archived"
  price: number
  stock: number
  createdAt: string
  activeCheckboxes: string[]
  handleEditToggle: () => void
  handleToggle: (productName: string) => void
  handleDelete: (productName: string) => void
  handleCheckbox: (productName: string) => void
}

export type EditProductProps = {
  selectedProduct: string
  isEditOpen: boolean
  setIsEditOpen: (value: boolean) => void
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
}

export type PaginationProps = {
  currentPage: number
  totalPages: number
  setSelectAll: (value: boolean) => void
}

export type ProductDisplayProps = {
  inventory: InventoryProps[]
  params: string
  currentPage: number
  totalPages: number
  totalItems: number
}
