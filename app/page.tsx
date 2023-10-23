"use client"

import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { getBoards } from "@/lib/dataUtils"
import Image from "next/image"
import Logo from "@/components/Logo"
import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"
import ModalSideBar from "../components/ModalSideBar"
import Modal from "../components/Modal"
import { Task } from "../types"
import ViewTaskModal from "@/components/ViewTaskModal"
import EditTaskModal from "@/components/EditTaskModal"
import DeleteModal from "@/components/DeleteModal"
import AddTaskModal from "@/components/AddTaskModal"
import AddBoardModal from "@/components/AddBoardModal"
import EditBoardModal from "@/components/EditBoardModal"
import SideBar from "../components/SideBar"
import showIcon from "@/public/show-icon.svg"
import { Board as BoardType } from "@/types"

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
    let latestBoardIndex = 0

    const [boards, setBoards] = useState<BoardType[]>([])
    const [isDataChanged, setIsDataChanged] = useState(false)
    const [showModalSideBar, setModalShowSideBar] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] = useState<ModalMode>("viewTask")
    const [showSideBar, setShowSideBar] = useLocalStorage(
        "kanban-show-sidebar",
        true
    )
    const [isDarkMode, setIsDarkMode] = useLocalStorage(
        "kanban-isDarkMode",
        true
    )

    const selectedTaskString = searchParams.get("task")

    if (selectedTaskString !== null && boards.length > 0) {
        const [columnIndexString, taskIndexString] =
            selectedTaskString.split("_")

        const columnIndex = Number(columnIndexString)
        const taskIndex = Number(taskIndexString)

        task = boards[selectedBoardIndex].columns[columnIndex].tasks[taskIndex]

        otherColumns = columnNames.filter((otherColumn, index) => {
            return columnIndex !== index
        })
    }

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
    // or an object or map to hold the different options
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
        modalToShow = (
            <AddBoardModal
                handleBackToBoard={handleBackToBoard}
                fetchData={fetchData}
                setIsDataChanged={setIsDataChanged}
            />
        )
    } else if (modalMode === "editBoard") {
        modalToShow = (
            <EditBoardModal
                board={boards[selectedBoardIndex]}
                handleBackToBoard={handleBackToBoard}
            />
        )
    } else if (modalMode === "deleteBoard") {
        modalToShow = (
            <DeleteModal
                isBoard={true}
                itemToDelete={boards[selectedBoardIndex]}
                handleBackToBoard={handleBackToBoard}
            />
        )
    }

    const router = useRouter()

    //get boards data
    //use hard-coded userId for now
    useEffect(() => {
        const fetchData = async () => {
            const boards = await getBoards(
                "be0fc8c3-496f-4ed8-9f27-32dcc66bba24"
            )

            setBoards(boards)
        }

        fetchData()
    }, [])

    useEffect(() => {
        if (boards.length > 0 && isDataChanged) {
            latestBoardIndex = boards.length - 1
            changeSelectedBoard(latestBoardIndex)
        }
    }, [boards.length, isDataChanged])

    // useEffect(() => {
    //     if (boards.length > 0) {
    //         console.log(boards[0].columns)
    //     }
    // }, [boards])

    useEffect(() => {
        if (isDarkMode) {
            document.querySelector("html")?.classList.add("dark")
        } else {
            document.querySelector("html")?.classList.remove("dark")
        }
    }, [isDarkMode])

    useEffect(() => {
        if (selectedBoardIndexParam === null) {
            changeSelectedBoard(0)
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
        changeSelectedBoard(selectedBoardIndex)
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

    function toggleDarkMode() {
        setIsDarkMode((prevValue: boolean) => !prevValue)
    }

    async function fetchData(userId: string) {
        const boards = await getBoards(userId)

        setBoards(boards)
    }

    function changeSelectedBoard(index: number) {
        router.push(`?board=${index}`)
    }

    //TODO:
    //      follow tutorial on using prisma (with postgresql) and nextjs
    //         -ideas:
    //            -DONE:create wrapper around prisma client to make it a singleton
    //              -helps with issues on dev server
    //         -inside server components I can fetch data directly
    //         -inside clients components I can call a Route Handler
    //            -this is recommended as Route Handlers run on the server and return data to the client
    //               -protecting senstive data you don't want sent to the client and working closer to the database
    //  -add CRUD operations for boards and tasks
    //   !!!   TODO: focus on adding the ability to CREATE data in database  !!!!
    //             -add abilty to create boards

    return (
        <main className="flex flex-col min-h-screen">
            <div
                className="
                flex w-full md:grid md:grid-rows-[1fr_18fr] md:grid-cols-[11fr_24fr] md:h-full md:fixed 
                lg:grid-cols-[1fr_3fr] xl:grid-cols-[1fr_6fr]"
            >
                <div
                    className={`hidden md:flex bg-neutral-100 md:dark:bg-neutral-700 md:pl-6 md:border-r-[1px] 
                        md:dark:border-neutral-600 md:border-neutral-300 ${
                            !showSideBar && "md:border-b-[1px]"
                        }`}
                >
                    <Logo isDarkMode={isDarkMode} />
                </div>
                <div
                    className="
                    flex flex-row fixed top-0 left-0 right-0 bg-neutral-100 dark:bg-neutral-700 pl-3 
                    md:relative md:border-b-[1px] md:dark:border-neutral-600 md:border-neutral-300"
                >
                    <div className="flex flex-row justify-center items-center md:hidden">
                        <Logo isDarkMode={isDarkMode} />
                    </div>
                    <HeaderBar
                        selectedBoardTitle={
                            boards.length > 0
                                ? boards[selectedBoardIndex].title
                                : ""
                        }
                        isSideBarShown={showModalSideBar}
                        isNoBoards={boards.length === 0}
                        isNoColumns={
                            boards[selectedBoardIndex].columns.length === 0
                        }
                        setIsModalOpen={setIsModalOpen}
                        handleShowAddTaskModal={handleShowAddTaskModal}
                        handleShowModalSideBar={handleShowModalSideBar}
                        handleSwitchModalMode={handleSwitchModalMode}
                    />
                </div>
                <div
                    className={`hidden bg-neutral-100 dark:bg-neutral-700 md:block lg:min-w-[15rem] ${
                        showSideBar ? "col-span-1" : "md:hidden"
                    }`}
                >
                    <SideBar
                        numBoards={boards.length}
                        boardNames={boards.map((board) => board.title)}
                        selectedBoardIndex={selectedBoardIndex}
                        handleShowAddBoardModal={handleShowAddBoardModal}
                        handleHideSideBar={handleHideSideBar}
                        handleShowSideBar={handleShowSideBar}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                    />
                </div>
                <div
                    className={`overflow-auto ${
                        showSideBar ? "col-span-1" : "col-span-2 pl-6"
                    }`}
                >
                    <Board
                        columns={
                            boards.length > 0
                                ? boards[selectedBoardIndex].columns
                                : []
                        }
                        handleSwitchModalMode={handleSwitchModalMode}
                        setIsModalOpen={setIsModalOpen}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>
            {showModalSideBar && (
                <ModalSideBar
                    numBoards={boards.length}
                    boardNames={boards.map((board) => board.title)}
                    selectedBoardIndex={selectedBoardIndex}
                    handleShowAddBoardModal={handleShowAddBoardModal}
                    handleShowModalSideBar={handleShowModalSideBar}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
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
