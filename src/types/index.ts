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
  handleEditToggle: (productName: string) => void
  status: "Active" | "Draft" | "Archived"
  price: number
  stock: number
  createdAt: string
  handleDelete: (productName: string) => void
}

export type EditProductProps = {
  selectedProduct: string
  isEditOpen: boolean
  setIsEditOpen: (value: boolean) => void
}
