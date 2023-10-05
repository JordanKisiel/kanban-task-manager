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

    //TODO:
    //  -style for other screen sizes
    //  -add the ability to switch themes
    //  -follow prisma tutorial
    //  -add CRUD operations for boards and tasks

    //TODO: consider using a switch structure
    // could polymorphism be applied here?
    if (modalMode === "editTask") {
        modalToShow = (
            <EditTaskModal
                task={task}
                otherColumns={otherColumns}
                currentColumn={currentColumn}
                handleSwitchModalMode={handleSwitchModalMode}
                handleBackToBoard={handleBackToBoard}
            />
        )
    } else if (modalMode === "deleteTask") {
        modalToShow = (
            <DeleteModal
                isBoard={false}
                itemToDelete={task}
                handleBackToBoard={handleBackToBoard}
            />
        )
    } else if (modalMode === "addTask") {
        modalToShow = (
            <AddTaskModal
                columnNames={columnNames}
                handleBackToBoard={handleBackToBoard}
            />
        )
    } else if (modalMode === "addBoard") {
        modalToShow = <AddBoardModal handleBackToBoard={handleBackToBoard} />
    } else if (modalMode === "editBoard") {
        modalToShow = (
            <EditBoardModal
                board={mockBoardsData.boards[selectedBoardIndex]}
                handleBackToBoard={handleBackToBoard}
            />
        )
    } else if (modalMode === "deleteBoard") {
        modalToShow = (
            <DeleteModal
                isBoard={true}
                itemToDelete={mockBoardsData.boards[selectedBoardIndex]}
                handleBackToBoard={handleBackToBoard}
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
    useEffect(() => {
        if (isModalOpen) {
            document.querySelector("body")?.classList.add("overflow-y-hidden")
            document.querySelector("body")?.classList.remove("overflow-scroll")
        } else {
            document.querySelector("body")?.classList.add("overflow-scroll")
            document
                .querySelector("body")
                ?.classList.remove("overflow-y-hidden")
            //also set state of modal mode back to viewTask
            //this accounts for case when user uses browser back button and closes modal
            setModalMode("viewTask")
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
                setIsModalOpen={setIsModalOpen}
                handleShowAddTaskModal={handleShowAddTaskModal}
                handleShowSideBar={handleShowSideBar}
                handleSwitchModalMode={handleSwitchModalMode}
            />
            <Board
                columns={mockBoardsData.boards[selectedBoardIndex].columns}
                handleSwitchModalMode={handleSwitchModalMode}
                setIsModalOpen={setIsModalOpen}
            />
            {showSideBar && (
                <SideBar
                    numBoards={boardNames.length}
                    boardNames={boardNames}
                    selectedBoardIndex={selectedBoardIndex}
                    handleShowAddBoardModal={handleShowAddBoardModal}
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
