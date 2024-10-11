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
          <PaginationLink href={`#${num}`}>{num}</PaginationLink>
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
            <PaginationLink href="#1">1</PaginationLink>
          </PaginationItem>
          {currentPage > 2 && <PaginationEllipsis />}
          {currentPage !== 1 && currentPage !== totalPages && (
            <PaginationItem
              onClick={() => handleClickedNumber(currentPage)}
              className="bg-slate-200 rounded-lg hover:bg-slate-200"
            >
              <PaginationLink href={`#${currentPage}`}>
                {currentPage}
              </PaginationLink>
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
            <PaginationLink href={`#${totalPages}`}>
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        </>
      )
    }
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
        {renderPageNumbers()}
        <PaginationItem>
          <PaginationNext href={`#${currentPage}`} onClick={handleNext} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  )
}
