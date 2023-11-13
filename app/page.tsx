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
import { Task } from "../types"
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
    const router = useRouter()

    const searchParams = useSearchParams()
    const selectedBoardIndexParam = searchParams.get("board")
    let selectedBoardIndex =
        selectedBoardIndexParam !== null ? Number(selectedBoardIndexParam) : 0

    let task: Task | null = null
    let columnIndex = 0
    let taskIndex = 0
    let otherColumns: string[] = []
    let currentColumn: string | null = null

    const [isBoardNewlyCreated, setIsBoardNewlyCreated] = useState(false)
    //hard-coding userid for now
    const { boards, isLoading, isError, mutate } = useBoards(
        "be0fc8c3-496f-4ed8-9f27-32dcc66bba24"
    )
    const [showModalSideBar, setModalShowSideBar] = useState(false)
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

        columnIndex = Number(columnIndexString)
        taskIndex = Number(taskIndexString)

        task = boards[selectedBoardIndex].columns[columnIndex].tasks[taskIndex]

        const columnTitles = boards[selectedBoardIndex].columns.map(
            (column) => column.title
        )

        currentColumn = columnTitles[columnIndex]

        otherColumns = columnTitles.filter((column, index) => {
            return columnIndex !== index
        })
    }

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

    function toggleDarkMode() {
        setIsDarkMode((prevValue: boolean) => !prevValue)
    }

    function changeSelectedBoard(index: number) {
        router.push(`?board=${index}`)
    }

    //TODO:
    //      -re-think the structure of my application based upon what I've learned in the nextjs course
    //        -specifically:
    //           -fetching data in components that need them and fetching data on the server side if at all possible
    //             -using Suspense and fallback skeletons for components that fetch data
    //           -write my data fetching functions to be more granualar
    //           -structure my components folder closer to what was in the course
    //           -instead of using an API layer, try using server actions instead
    //              -if I HAVE to fetch data on the client, then I should be using an API layer
    //           -think about my route structure (use the userId as a dynamic route to access the associated boards?)
    //           -use noStore or force-dynamic using segment config options
    //           -simulate slow data fetch to see what the experience is and make sure it works write
    //           -simulate and handle errors
    //     -in general, it's a good practice to move data fetching down into the components that need it and wrapping them in
    //       Suspense
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
                        selectedBoardIndex={selectedBoardIndex}
                        columnIndex={columnIndex}
                        taskIndex={taskIndex}
                        isSideBarShown={showModalSideBar}
                        handleShowModalSideBar={handleShowModalSideBar}
                    />
                </div>
                <div
                    className={`hidden bg-neutral-100 dark:bg-neutral-700 md:block lg:min-w-[15rem] ${
                        showSideBar ? "col-span-1" : "md:hidden"
                    }`}
                >
                    <SideBar
                        selectedBoardIndex={selectedBoardIndex}
                        columnIndex={columnIndex}
                        taskIndex={taskIndex}
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
                        selectedBoardIndex={selectedBoardIndex}
                        columnIndex={columnIndex}
                        taskIndex={taskIndex}
                        isDarkMode={isDarkMode}
                    />
                </div>
            </div>
            {showModalSideBar && (
                <ModalSideBar
                    selectedBoardIndex={selectedBoardIndex}
                    columnIndex={columnIndex}
                    taskIndex={taskIndex}
                    handleShowModalSideBar={handleShowModalSideBar}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                />
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
