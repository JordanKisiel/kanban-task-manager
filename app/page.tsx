"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"
import SideBar from "../components/SideBar"
import mockBoardsData from "../data/mockData.json"

export default function Home() {
    const searchParams = useSearchParams()
    const selectedBoardIndex = Number(searchParams.get("board"))

    const [showSideBar, setShowSideBar] = useState(false)

    const boardNames = mockBoardsData.boards.map((board) => {
        return board.title
    })

    const router = useRouter()

    useEffect(() => {
        if (selectedBoardIndex === 0) {
            router.push("?board=0")
        }
    }, [selectedBoardIndex])

    //TODO: use board param to display correct board
    const userBoards = ["Platform Launch", "Marketing Plan", "Roadmap"]

    function handleShowSideBar(event: PointerEvent) {
        setShowSideBar((prevValue) => !prevValue)
    }

    return (
        <main className="flex flex-col min-h-screen">
            <HeaderBar
                selectedBoard={mockBoardsData.boards[selectedBoardIndex].title}
                isSideBarShown={showSideBar}
                handleShowSideBar={handleShowSideBar}
            />
            <Board
                columns={mockBoardsData.boards[selectedBoardIndex].columns}
            />
            {showSideBar && (
                <SideBar
                    numBoards={boardNames.length}
                    boardNames={boardNames}
                    selectedBoardIndex={selectedBoardIndex}
                    handleShowSideBar={handleShowSideBar}
                />
            )}
        </main>
    )
}
