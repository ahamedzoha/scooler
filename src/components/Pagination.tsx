"use client";
import { cn } from "@/lib/cn.util";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination.constant";
import { useRouter } from "next/navigation";

type PaginationProps = {
  /**
   * The current page number.
   * It can be either a number or string but will be parsed as an integer.
   */
  page: number | string;

  /**
   * The total count of items.
   * It can be either a number or string but will be parsed as an integer.
   */
  count: number | string;
};

/**
 * Pagination component that displays pagination buttons and handles page navigation.
 *
 * @param {PaginationProps} props - The properties for pagination including page and count.
 * @returns A JSX element representing pagination controls.
 */
const Pagination = ({ page, count }: PaginationProps) => {
  // Normalize page and count values to integers
  const currentPage = parseInt(page.toString(), 10);
  const totalCount = parseInt(count.toString(), 10);

  const router = useRouter();

  /**
   * Navigates to a new page by updating the URL's query parameter.
   *
   * @param {number} newPage - The new page number to navigate to.
   */
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`${window.location.pathname}?${params}`);
  };

  return (
    <div className="p-4 flex items-center justify-between text-gray-500">
      <button
        disabled={currentPage === 1}
        onClick={() => changePage(currentPage - 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Prev
      </button>
      <div className="flex items-center gap-2 text-sm">
        {Array.from({ length: Math.ceil(totalCount / ITEMS_PER_PAGE) }).map(
          (_, index) => {
            // Display the first 5 pages or the current page
            if (index < 5 || index === currentPage - 1) {
              return (
                <button
                  key={index}
                  className={cn(
                    "px-2 py-1 rounded-md",
                    index + 1 === currentPage && "bg-lamaSky"
                  )}
                  onClick={() => changePage(index + 1)}
                >
                  {index + 1}
                </button>
              );
            }
            // Display an ellipsis after the 5th page
            else if (index === 5) {
              return (
                <button
                  key={index}
                  onClick={() => changePage(index + 1)}
                  className="px-2 py-1 rounded-md"
                >
                  ...
                </button>
              );
            }
            return null;
          }
        )}
      </div>
      <button
        disabled={currentPage === Math.ceil(totalCount / ITEMS_PER_PAGE)}
        onClick={() => changePage(currentPage + 1)}
        className="py-2 px-4 rounded-md bg-slate-200 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
