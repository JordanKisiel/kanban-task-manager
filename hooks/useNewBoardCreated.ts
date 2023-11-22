import { useState, useEffect } from "react"
import { useBoards } from "@/lib/dataUtils"
import { testUserId } from "@/testing/testingConsts"
import { useRouter } from "next/navigation"

export function useNewBoardCreated() {
    const { boards, isLoading } = useBoards(testUserId)
    const [newBoardCreated, setNewBoardCreated] = useState(false)

    const router = useRouter()

    useEffect(() => {
        if (newBoardCreated && !isLoading) {
            router.push(`/?board=${boards.length - 1}`)
            setNewBoardCreated(false)
        }
    }, [newBoardCreated, isLoading])

    return { newBoardCreated, setNewBoardCreated }
}
