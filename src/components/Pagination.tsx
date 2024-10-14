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
import { usePathname, useRouter } from "next/navigation"

export function PaginationUI(props: PaginationProps) {
  const { currentPage, totalPages } = props
  const router = useRouter()
  const path = usePathname()

  const handleNext = () => {
    if (currentPage < totalPages) {
      router.push(`${path}?page=${currentPage + 1}`)
    }
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      router.push(`${path}?page=${currentPage - 1}`)
    }
  }

  const handleClickedNumber = (num: number) => {
    router.push(`${path}?page=${num}`)
  }

  const renderPageNumbers = () => {
    if (totalPages <= 3) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
        <PaginationItem
          key={num}
          onClick={() => handleClickedNumber(num)}
          className={`${
            currentPage === num && "bg-slate-200 rounded-lg hover:bg-slate-200"
          } `}
        >
          <PaginationLink>{num}</PaginationLink>
        </PaginationItem>
      ))
    } else {
      return (
        <>
          <PaginationItem
            onClick={() => handleClickedNumber(1)}
            className={`${
              currentPage === 1 && "bg-slate-200 rounded-lg hover:bg-slate-200"
            } `}
          >
            <PaginationLink>1</PaginationLink>
          </PaginationItem>
          {currentPage > 2 && <PaginationEllipsis />}
          {currentPage !== 1 && currentPage !== totalPages && (
            <PaginationItem
              onClick={() => handleClickedNumber(currentPage)}
              className="bg-slate-200 rounded-lg hover:bg-slate-200"
            >
              <PaginationLink>{currentPage}</PaginationLink>
            </PaginationItem>
          )}
          {currentPage < totalPages - 1 && <PaginationEllipsis />}
          <PaginationItem
            onClick={() => handleClickedNumber(totalPages)}
            className={`${
              currentPage === totalPages &&
              "bg-slate-200 rounded-lg hover:bg-slate-200"
            } `}
          >
            <PaginationLink>{totalPages}</PaginationLink>
          </PaginationItem>
        </>
      )
    }
  }

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious onClick={handlePrevious} />
        </PaginationItem>
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
