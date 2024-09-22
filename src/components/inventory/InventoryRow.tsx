import { TableCell, TableRow } from "@/components/ui/table"
import { InventoryProps } from "@/types"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu"
import { Button } from "../ui/button"
import { MoreHorizontal } from "lucide-react"
import { Badge } from "../ui/badge"
import { formatDate } from "@/lib/utils"

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
  const formattedDate = formatDate(createdAt)

  return (
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
      <TableCell className="hidden md:table-cell">{formattedDate}</TableCell>
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
            <DropdownMenuItem onClick={handleEditToggle}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleDelete(productName)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}

export default InventoryRow
