import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { PaginationProps } from "@/types"

export function PaginationUI(props: PaginationProps) {
  const { currentPage, setCurrentPage, totalPages } = props
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1)

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleClickedNumber = (num: number) => {
    setCurrentPage(num)
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={`#${currentPage}`}
            onClick={handlePrevious}
          />
        </PaginationItem>
        {pageNumbers.map((num) => (
          <PaginationItem key={num} onClick={() => handleClickedNumber(num)}>
            <PaginationLink href={`#${num}`}>{num}</PaginationLink>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext href={`#${currentPage}`} onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
