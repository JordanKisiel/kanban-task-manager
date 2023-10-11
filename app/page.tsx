"use client"

import { useDarkMode } from "usehooks-ts"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import Image from "next/image"
import Logo from "@/components/Logo"
import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"
import ModalSideBar from "../components/ModalSideBar"
import Modal from "../components/Modal"
import { Task } from "../types"
import mockBoardsData from "../data/mockData.json"
import ViewTaskModal from "@/components/ViewTaskModal"
import EditTaskModal from "@/components/EditTaskModal"
import DeleteModal from "@/components/DeleteModal"
import AddTaskModal from "@/components/AddTaskModal"
import AddBoardModal from "@/components/AddBoardModal"
import EditBoardModal from "@/components/EditBoardModal"
import SideBar from "../components/SideBar"
import showIcon from "@/public/show-icon.svg"

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

    const [showModalSideBar, setModalShowSideBar] = useState(false)
    const [showSideBar, setShowSideBar] = useState(true)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("viewTask")

    const { isDarkMode, toggle, enable, disable } = useDarkMode(true)

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
        if (isDarkMode) {
            document.querySelector("html")?.classList.add("dark")
        } else {
            document.querySelector("html")?.classList.remove("dark")
        }
    }, [isDarkMode])

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
    function handleShowModalSideBar(event: PointerEvent) {
        setModalShowSideBar((prevValue) => !prevValue)
    }

    function handleHideSideBar() {
        setShowSideBar(false)
    }

    function handleShowSideBar() {
        setShowSideBar(true)
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

    //TODO:
    //      -get rid of flash of light mode when using dark mode (useLayoutEffect ?)
    //      -make dark mode default
    //      -componentize modals (headers, labels, etc)
    //      follow tutorial about prisma
    //      research proper way to represent data in relational database
    //      follow tutorial on using prisma (with postgresql) and nextjs
    //  -add CRUD operations for boards and tasks

    return (
        <main className="flex flex-col min-h-screen">
            <div className="flex w-full md:grid md:grid-rows-[1fr_18fr] md:grid-cols-[11fr_24fr] md:h-full md:fixed lg:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_6fr]">
                <div
                    className={`hidden md:flex bg-neutral-100 md:dark:bg-neutral-700 md:pl-6 md:border-r-[1px] md:dark:border-neutral-600 md:border-neutral-300 ${
                        !showSideBar && "md:border-b-[1px]"
                    }`}
                >
                    <Logo isDarkMode={isDarkMode} />
                </div>
                <div className="flex flex-row fixed top-0 left-0 right-0 bg-neutral-100 dark:bg-neutral-700 pl-3 md:relative md:border-b-[1px] md:dark:border-neutral-600 md:border-neutral-300">
                    <div className="flex flex-row justify-center items-center md:hidden">
                        <Logo isDarkMode={isDarkMode} />
                    </div>
                    <HeaderBar
                        selectedBoard={
                            mockBoardsData.boards[selectedBoardIndex].title
                        }
                        isSideBarShown={showModalSideBar}
                        setIsModalOpen={setIsModalOpen}
                        handleShowAddTaskModal={handleShowAddTaskModal}
                        handleShowModalSideBar={handleShowModalSideBar}
                        handleSwitchModalMode={handleSwitchModalMode}
                    />
                </div>
                <div
                    className={`hidden bg-neutral-100 dark:bg-neutral-700 md:block ${
                        showSideBar ? "col-span-1" : "md:hidden"
                    }`}
                >
                    <SideBar
                        numBoards={boardNames.length}
                        boardNames={boardNames}
                        selectedBoardIndex={selectedBoardIndex}
                        handleShowAddBoardModal={handleShowAddBoardModal}
                        handleHideSideBar={handleHideSideBar}
                        handleShowSideBar={handleShowSideBar}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggle}
                    />
                </div>
                <div
                    className={`overflow-auto ${
                        showSideBar ? "col-span-1" : "col-span-2 pl-6"
                    }`}
                >
                    <Board
                        columns={
                            mockBoardsData.boards[selectedBoardIndex].columns
                        }
                        handleSwitchModalMode={handleSwitchModalMode}
                        setIsModalOpen={setIsModalOpen}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>
            {showModalSideBar && (
                <ModalSideBar
                    numBoards={boardNames.length}
                    boardNames={boardNames}
                    selectedBoardIndex={selectedBoardIndex}
                    handleShowAddBoardModal={handleShowAddBoardModal}
                    handleShowModalSideBar={handleShowModalSideBar}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggle}
                />
            )}
            {isModalOpen && (
                <Modal handleBackToBoard={handleBackToBoard}>
                    {modalToShow}
                </Modal>
            )}
            {!showSideBar && (
                <button
                    onClick={() => handleShowSideBar()}
                    className="bg-purple-600 fixed bottom-12 rounded-r-full p-5"
                >
                    <Image
                        src={showIcon}
                        alt="Show Sidebar Icon"
                    />
                </button>
            )}
        </main>
    )
}
