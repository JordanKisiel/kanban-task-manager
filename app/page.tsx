"use client"

import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useModal } from "@/hooks/useModal"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import Logo from "@/components/Logo"
import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"
import SideBar from "../components/SideBar"
import Modal from "@/components/Modal"
import showIcon from "@/public/show-icon.svg"
import { useQuery } from "@tanstack/react-query"
import { boardsByUserOptions, taskByIdOptions } from "@/lib/queries"
import { testUserId } from "@/testing/testingConsts"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"
import ViewTaskModal from "@/components/ViewTaskModal"
import DeleteModal from "@/components/DeleteModal"
import EditTaskModal from "@/components/EditTaskModal"

export default function Home() {
    const router = useRouter()
    const searchParams = useSearchParams()

    //null values default to zero when cast to number
    const selectedBoardIndex = Number(searchParams.get("board"))
    let taskId = searchParams.get("task")
        ? Number(searchParams.get("task"))
        : null

    const boards = useQuery(boardsByUserOptions(testUserId))

    const task = useQuery(taskByIdOptions(taskId))

    const { setNewBoardCreated } = useNewBoardCreated(
        boards.isPending,
        boards.data
    )

    //if there is no board search param, route to a board index of 0
    useEffect(() => {
        if (searchParams.get("board") === null) {
            router.push("?boards=0")
        }
    }, [searchParams.get("board")])

    //if there's a task search param, open up viewtask modal
    //to display that task
    useEffect(() => {
        if (taskId !== null) {
            setModalMode("viewTask")
            setIsModalOpen(true)
        } else {
            setIsModalOpen(false)
        }
    }, [taskId])

    const [isModalOpen, setIsModalOpen, modalMode, setModalMode] = useModal(
        "viewTask",
        false
    )

    //set to an empty element since these modals
    //should never be open if taskId is null
    //TODO:
    //  is probably better to account for the situation in which
    //  the url is being manipulated manually
    //    ex. taskId set to a non-valid id
    //        i.e. id not in the currently selected board
    let modalContent: React.ReactElement = <></>

    if (taskId !== null) {
        if (modalMode === "viewTask") {
            modalContent = (
                <ViewTaskModal
                    selectedBoardIndex={selectedBoardIndex}
                    columns={boards.data[selectedBoardIndex].columns}
                    taskId={taskId}
                    setIsModalOpen={setIsModalOpen}
                    setModalMode={setModalMode}
                />
            )
        } else if (modalMode === "editTask") {
            modalContent = (
                <EditTaskModal
                    selectedBoardIndex={selectedBoardIndex}
                    columns={boards.data[selectedBoardIndex].columns}
                    taskId={taskId}
                    setIsModalOpen={setIsModalOpen}
                    setModalMode={setModalMode}
                />
            )
        } else {
            modalContent = (
                <DeleteModal
                    isBoard={false}
                    itemToDelete={task.data}
                    changeSelectedBoardIndex={changeSelectedBoardIndex}
                    selectedBoardIndex={selectedBoardIndex}
                    setIsModalOpen={setIsModalOpen}
                />
            )
        }
    }

    const [isDarkMode, toggleDarkMode] = useDarkMode("kanban-isDarkMode")

    const [showSideBar, setShowSideBar] = useLocalStorage(
        "kanban-show-sidebar",
        true
    )

    function changeSelectedBoardIndex(index: number) {
        router.push(`/?board=${index}`)
    }

    function handleHideSideBar() {
        setShowSideBar(false)
    }

    function handleShowSideBar() {
        setShowSideBar(true)
    }

    return (
        <main className="flex flex-col min-h-screen">
            <div
                className="
                flex w-full md:grid md:grid-rows-[1fr_18fr] md:grid-cols-[16.5rem_24fr] md:h-full md:fixed 
                lg:grid-cols-[17rem_3fr] xl:grid-cols-[17rem_6fr]"
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
                        boardId={boards.data[selectedBoardIndex].id}
                        numBoards={boards.data.length}
                        boards={boards.data}
                        selectedBoardIndex={selectedBoardIndex}
                        taskId={taskId}
                        changeSelectedBoardIndex={changeSelectedBoardIndex}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                    />
                </div>
                <div
                    className={`hidden bg-neutral-100 dark:bg-neutral-700 md:block lg:min-w-[15rem] ${
                        showSideBar ? "col-span-1" : "md:hidden"
                    }`}
                >
                    <SideBar
                        handleHideSideBar={handleHideSideBar}
                        handleShowSideBar={handleShowSideBar}
                        isDarkMode={isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                        selectedBoardIndex={selectedBoardIndex}
                        boards={boards}
                        isPending={isPending}
                        taskId={taskId}
                        changeSelectedBoardIndex={changeSelectedBoardIndex}
                    />
                </div>
                <div
                    className={`overflow-auto ${
                        showSideBar ? "col-span-1" : "col-span-2 pl-6"
                    }`}
                >
                    <Board
                        isDarkMode={isDarkMode}
                        changeSelectedBoardIndex={changeSelectedBoardIndex}
                        selectedBoardIndex={selectedBoardIndex}
                        taskId={taskId}
                    />
                </div>
            </div>
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
            {isModalOpen && (
                <Modal
                    selectedBoardIndex={selectedBoardIndex}
                    setIsModalOpen={setIsModalOpen}
                >
                    {modalContent}
                </Modal>
            )}
        </main>
    )
}
