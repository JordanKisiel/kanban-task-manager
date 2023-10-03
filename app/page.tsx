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
import AddTaskModal from "@/components/AddTaskModal"
import AddBoardModal from "@/components/AddBoardModal"
import EditBoardModal from "@/components/EditBoardModal"

type ModalMode =
    | "viewTask"
    | "editTask"
    | "deleteTask"
    | "addTask"
    | "addBoard"
    | "editBoard"
    | "deleteBoard"

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
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("viewTask")

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
            handleSwitchModalMode={handleSwitchModalMode}
            handleBackToBoard={handleBackToBoard}
        />
    )

    if (modalMode === "editTask") {
        modalToShow = (
            <EditTaskModal
                task={task}
                otherColumns={otherColumns}
                currentColumn={currentColumn}
            />
        )
    } else if (modalMode === "deleteTask") {
        modalToShow = (
            <DeleteModal
                isBoard={false}
                itemToDelete={task}
            />
        )
    } else if (modalMode === "addTask") {
        modalToShow = <AddTaskModal columnNames={columnNames} />
    } else if (modalMode === "addBoard") {
        modalToShow = <AddBoardModal />
    } else if (modalMode === "editBoard") {
        modalToShow = (
            <EditBoardModal board={mockBoardsData.boards[selectedBoardIndex]} />
        )
    } else if (modalMode === "deleteBoard") {
        modalToShow = (
            <DeleteModal
                isBoard={true}
                itemToDelete={mockBoardsData.boards[selectedBoardIndex]}
            />
        )
    }

    const router = useRouter()

    useEffect(() => {
        if (selectedBoardIndexParam === null) {
            router.push("?board=0")
        }
    }, [selectedBoardIndexParam])

    useEffect(() => {
        if (task !== null) {
            setIsModalOpen(true)
        } else {
            setIsModalOpen(false)
        }
    }, [task])

    //stop scrolling when modal is open
    //more specifically in this case, when a task is selected
    //also do this when board modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.querySelector("body")?.classList.add("overflow-y-hidden")
        } else {
            document.querySelector("body")?.classList.add("overflow-scroll")
        }
    }, [isModalOpen])

    //should this be a pointer event? or just a mouse event
    function handleShowSideBar(event: PointerEvent) {
        setShowSideBar((prevValue) => !prevValue)
    }

    function handleBackToBoard() {
        router.push(`?board=${selectedBoardIndex}`)
        setModalMode("viewTask")
        setIsModalOpen(false)
    }

    function handleSwitchModalMode(mode: ModalMode) {
        setModalMode(mode)
    }

    function handleShowAddTaskModal() {
        setModalMode("addTask")
        setIsModalOpen(true)
    }

    function handleShowAddBoardModal() {
        setModalMode("addBoard")
        setIsModalOpen(true)
    }

    return (
        <main className="flex flex-col min-h-screen">
            <HeaderBar
                selectedBoard={mockBoardsData.boards[selectedBoardIndex].title}
                isSideBarShown={showSideBar}
                handleShowAddTaskModal={handleShowAddTaskModal}
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
            {isModalOpen && (
                <Modal handleBackToBoard={handleBackToBoard}>
                    {modalToShow}
                </Modal>
            )}
        </main>
    )
}
