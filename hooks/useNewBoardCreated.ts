import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Board } from "@/types"

export function useNewBoardCreated(
    boardsQueryIsPending: boolean,
    boards: Board[] | undefined
) {
    const [newBoardCreated, setNewBoardCreated] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (newBoardCreated && !boardsQueryIsPending && boards) {
            if (boards.length > 0) {
                router.push(`?board=${boards.length}`)
            } else {
                router.push(`?board=0`)
            }
            setNewBoardCreated(false)
        }
    }, [newBoardCreated, boardsQueryIsPending])

    return { newBoardCreated, setNewBoardCreated }
}
