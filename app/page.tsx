"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"
import SideBar from "../components/SideBar"
import TaskModal from "../components/TaskModal"
import { Task } from "../types"
import mockBoardsData from "../data/mockData.json"

export default function Home() {
    const searchParams = useSearchParams()
    const selectedBoardIndexParam = searchParams.get("board")
    let selectedBoardIndex = 0

    if (selectedBoardIndexParam !== null) {
        selectedBoardIndex = Number(selectedBoardIndexParam)
    }

    let task: Task | null = null
    let otherColumns: string[] = []
    let currentColumn: string | null = null

    const selectedTaskString = searchParams.get("task")

    if (selectedTaskString !== null) {
        const [columnIndexString, taskIndexString] =
            selectedTaskString.split("_")

        const columnIndex = Number(columnIndexString)
        const taskIndex = Number(taskIndexString)

        task =
            mockBoardsData.boards[selectedBoardIndex].columns[columnIndex]
                .tasks[taskIndex]

        const columnNames = mockBoardsData.boards[
            selectedBoardIndex
        ].columns.map((column) => {
            return column.title
        })

        otherColumns = columnNames.filter((otherColumn, index) => {
            return columnIndex !== index
        })

        currentColumn =
            mockBoardsData.boards[selectedBoardIndex].columns[columnIndex].title
    }

    const [showSideBar, setShowSideBar] = useState(false)

    const boardNames = mockBoardsData.boards.map((board) => {
        return board.title
    })

    const router = useRouter()

    useEffect(() => {
        if (selectedBoardIndexParam === null) {
            router.push("?board=0")
        }
    }, [selectedBoardIndexParam])

    function handleShowSideBar(event: PointerEvent) {
        setShowSideBar((prevValue) => !prevValue)
    }

    function handleBackToBoard() {
        router.push(`?board=${selectedBoardIndex}`)
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
            {task !== null &&
                otherColumns.length !== 0 &&
                currentColumn !== null && (
                    <TaskModal
                        task={task}
                        otherColumns={otherColumns}
                        currentColumn={currentColumn}
                        handleBackToBoard={handleBackToBoard}
                    />
                )}
        </main>
    )
}
