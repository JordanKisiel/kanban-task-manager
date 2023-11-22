import { useSearchParams } from "next/navigation"

export function useUrlIndices() {
    const searchParams = useSearchParams()

    //null values default to zero when cast to number
    const selectedBoardIndex = Number(searchParams.get("board"))
    const columnIndex = Number(searchParams.get("col"))
    const taskIndex = Number(searchParams.get("task"))

    return { selectedBoardIndex, columnIndex, taskIndex }
}
