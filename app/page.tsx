"use client"

import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useSearchParams, useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { useBoards } from "@/lib/dataUtils"
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
    const router = useRouter()

    const searchParams = useSearchParams()
    const selectedBoardIndexParam = searchParams.get("board")
    let selectedBoardIndex =
        selectedBoardIndexParam !== null ? Number(selectedBoardIndexParam) : 0

    let task: Task | null = null
    let otherColumns: string[] = []
    let currentColumn: string | null = null

    const [isBoardNewlyCreated, setIsBoardNewlyCreated] = useState(false)
    const [boards, setBoards] = useState<BoardType[]>([])
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

    //check if there is a board at the selected index
    //if not, change selected index to highest available
    if (!boards[selectedBoardIndex]) {
        if (boards.length > 0) {
            selectedBoardIndex = boards.length - 1
        } else {
            //TODO:
            //  --what should happen if the user has no boards?
        }
    }

    if (selectedTaskString !== null && boards.length > 0) {
        const [columnIndexString, taskIndexString] =
            selectedTaskString.split("_")

        const columnIndex = Number(columnIndexString)
        const taskIndex = Number(taskIndexString)

        task = boards[selectedBoardIndex].columns[columnIndex].tasks[taskIndex]

        const columnTitles = boards[selectedBoardIndex].columns.map(
            (column) => column.title
        )

        currentColumn = columnTitles[columnIndex]

        otherColumns = columnTitles.filter((column, index) => {
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
                numBoards={boards.length}
                itemToDelete={task}
                changeSelectedBoard={changeSelectedBoard}
                fetchData={fetchData}
                handleBackToBoard={handleBackToBoard}
            />
        )
    } else if (modalMode === "addTask") {
        modalToShow = (
            <AddTaskModal
                columns={boards ? boards[selectedBoardIndex].columns : []}
                fetchData={fetchData}
                handleBackToBoard={handleBackToBoard}
            />
        )
    } else if (modalMode === "addBoard") {
        modalToShow = (
            <AddBoardModal
                setIsBoardNewlyCreated={setIsBoardNewlyCreated}
                handleBackToBoard={handleBackToBoard}
                fetchData={fetchData}
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
                numBoards={boards.length}
                itemToDelete={boards[selectedBoardIndex]}
                fetchData={fetchData}
                changeSelectedBoard={changeSelectedBoard}
                handleBackToBoard={handleBackToBoard}
            />
        )
    }

    //get boards data
    //use hard-coded userId for now
    useEffect(() => {
        fetchData("be0fc8c3-496f-4ed8-9f27-32dcc66bba24")
    }, [])

    useEffect(() => {
        if (boards.length > 0 && isBoardNewlyCreated) {
            changeSelectedBoard(boards.length - 1)
            setIsBoardNewlyCreated(false)
        }
    }, [boards, isBoardNewlyCreated])

    useEffect(() => {
        changeSelectedBoard(selectedBoardIndex)
    }, [selectedBoardIndex])

    useEffect(() => {
        if (isDarkMode) {
            document.querySelector("html")?.classList.add("dark")
        } else {
            document.querySelector("html")?.classList.remove("dark")
        }
    }, [isDarkMode])

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
        const res = await getBoards(userId)
        const boards = await res.json()

        setBoards(boards)

        return res.ok
    }

    function changeSelectedBoard(index: number) {
        router.push(`?board=${index}`)
    }

    //TODO:
    //     -Start integrating SWR data fetching hook (useBoards)
    //        -making INCREMENTAL changes and test to make sure app still functions
    //     -go through hooks ONE BY ONE and see if I can remove them from this page so that it can be a server component
    //         -INCREMENTAL THIS TIME -> TEST AND GET EACH CHANGE WORKING FIRST
    //     -change ViewTaskModal so it doesn't get warning
    //       -ViewTaskModal needs the ability to change subTask isComplete state
    //         -this is an UPDATE operation
    //
    // -no indication that data is being submitted to the user
    //      -I need a loading state (maybe I should try using SWR? probably would have to research and learn to a certain extent)
    // -review code (especially this page component) to see if what can be abstracted out and if the page can be made a server
    //  component by moving hooks into child components

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
                            boards.length > 0 &&
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
                        width={16}
                        height={11}
                    />
                </button>
            )}
        </main>
    )
}
