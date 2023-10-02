"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"
import SideBar from "../components/SideBar"
import Modal from "../components/Modal"
import { Task } from "../types"
import mockBoardsData from "../data/mockData.json"
import ViewTaskModal from "@/components/ViewTaskModal"
import EditTaskModal from "@/components/EditTaskModal"
import DeleteModal from "@/components/DeleteModal"

type TaskModalMode = "view" | "edit" | "delete"

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
    let columnNames: string[] = [""]

    const [showSideBar, setShowSideBar] = useState(false)
    const [taskModalMode, setTaskModalMode] = useState<TaskModalMode>("view")

    const selectedTaskString = searchParams.get("task")

    if (selectedTaskString !== null) {
        const [columnIndexString, taskIndexString] =
            selectedTaskString.split("_")

        const columnIndex = Number(columnIndexString)
        const taskIndex = Number(taskIndexString)

        task =
            mockBoardsData.boards[selectedBoardIndex].columns[columnIndex]
                .tasks[taskIndex]

        columnNames = mockBoardsData.boards[selectedBoardIndex].columns.map(
            (column) => {
                return column.title
            }
        )

        otherColumns = columnNames.filter((otherColumn, index) => {
            return columnIndex !== index
        })

        currentColumn =
            mockBoardsData.boards[selectedBoardIndex].columns[columnIndex].title
    }

    const boardNames = mockBoardsData.boards.map((board) => {
        return board.title
    })

    let modalToShow = (
        <ViewTaskModal
            task={task}
            otherColumns={otherColumns}
            currentColumn={currentColumn}
            handleSwitchTaskModalMode={handleSwitchTaskModalMode}
            handleBackToBoard={handleBackToBoard}
        />
    )

    if (taskModalMode === "edit") {
        modalToShow = (
            <EditTaskModal
                task={task}
                otherColumns={otherColumns}
                currentColumn={currentColumn}
            />
        )
    } else if (taskModalMode === "delete") {
        modalToShow = (
            <DeleteModal
                isBoard={false}
                itemToDelete={task}
            />
        )
    }

    const router = useRouter()

    useEffect(() => {
        if (selectedBoardIndexParam === null) {
            router.push("?board=0")
        }
    }, [selectedBoardIndexParam])

    //stop scrolling when modal is open
    //more specifically in this case, when a task is selected
    useEffect(() => {
        if (task !== null) {
            document.querySelector("body")?.classList.add("overflow-y-hidden")
        } else {
            document.querySelector("body")?.classList.add("overflow-scroll")
        }
    }, [task])

    //should this be a pointer event? or just a mouse event
    function handleShowSideBar(event: PointerEvent) {
        setShowSideBar((prevValue) => !prevValue)
    }

    function handleBackToBoard() {
        router.push(`?board=${selectedBoardIndex}`)
    }

    function handleSwitchTaskModalMode(mode: TaskModalMode) {
        setTaskModalMode(mode)
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
            {task !== null && (
                <Modal handleBackToBoard={handleBackToBoard}>
                    {modalToShow}
                </Modal>
            )}
        </main>
    )
}
