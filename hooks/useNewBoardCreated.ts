import { useState, useEffect } from "react"
import { testUserId } from "@/testing/testingConsts"
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
            router.push(`/?board=${boards.length - 1}`)
            setNewBoardCreated(false)
        }
    }, [newBoardCreated, boardsQueryIsPending])

    return { newBoardCreated, setNewBoardCreated }
}
