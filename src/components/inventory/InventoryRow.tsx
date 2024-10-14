import { TableCell, TableRow } from "@/components/ui/table"
import { InventoryProps } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "../ui/badge"
import { formatDate } from "@/utils/utils"
import { useEffect, useState } from "react"

const InventoryRow = (props: InventoryProps) => {
  const {
    productName,
    status,
    price,
    stock,
    createdAt,
    handleToggle,
    handleDelete,
    handleEditToggle,
  } = props

  const [isDeleteOpen, setIsDeleteOpen] = useState<boolean>(false)
  const [date, setDate] = useState<string | null>()

  const handleDeleteToggle = () => {
    setIsDeleteOpen((prev) => !prev)
  }

  useEffect(() => {
    const formattedDate = formatDate(createdAt)
    setDate(formattedDate)
  }, [createdAt])

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{productName}</TableCell>
        <TableCell>
          {status === "Active" ? (
            <Badge variant="default">{status}</Badge>
          ) : (
            <Badge variant="outline">{status}</Badge>
          )}
        </TableCell>
        <TableCell>${price}</TableCell>
        <TableCell className="hidden md:table-cell">{stock}</TableCell>
        <TableCell className="hidden md:table-cell">{date}</TableCell>
        <TableCell>
          <DropdownMenu onOpenChange={() => handleToggle(productName)}>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={handleEditToggle}>
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteToggle}>
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {isDeleteOpen && (
        <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <AlertDialogTrigger asChild>Delete</AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                product.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => handleDelete(productName)}>
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </>
  )
}

export default InventoryRow
