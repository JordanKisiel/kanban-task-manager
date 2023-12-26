"use client"

import { useQuery } from "@tanstack/react-query"
import { allBoardsOptions } from "@/lib/queries"
import { testUserId } from "@/testing/testingConsts"

export default function Home() {
    const {
        data: boards,
        isError,
        isPending,
    } = useQuery(allBoardsOptions(testUserId))

    if (!isPending) {
        console.log(boards)
    }

    return <></>
}
