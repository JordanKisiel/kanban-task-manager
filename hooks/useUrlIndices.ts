import { useSearchParams, useRouter } from "next/navigation"

export function useUrlIndices() {
    const searchParams = useSearchParams()
    const router = useRouter()

    //null values default to zero when cast to number
    const selectedBoardIndex = Number(searchParams.get("board"))
    const columnIndex = Number(searchParams.get("col"))
    const taskIndex = Number(searchParams.get("task"))

    function changeSelectedBoardIndex(index: number) {
        router.push(`/?board=${index}`)
    }

    return {
        selectedBoardIndex,
        columnIndex,
        taskIndex,
        changeSelectedBoardIndex,
    }
}
