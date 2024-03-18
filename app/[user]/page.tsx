"use client"

import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useModal } from "@/hooks/useModal"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import Logo from "@/components/app-elements/Logo"
import HeaderBar from "@/components/app-elements/HeaderBar"
import Board from "@/components/app-elements/Board"
import SideBar from "@/components/app-elements/SideBar"
import Modal from "@/components/modals/Modal"
import showIcon from "@/public/show-icon.svg"
import { useQuery } from "@tanstack/react-query"
import { boardsByUserOptions, taskByIdOptions } from "@/lib/queries"
import ViewTaskModal from "@/components/modals/ViewTaskModal"
import DeleteModal from "@/components/modals/DeleteModal"
import EditTaskModal from "@/components/modals/EditTaskModal"
import ErrorModal from "@/components/modals/ErrorModal"

export default function Home({ params }: { params: { user: string } }) {
    const router = useRouter()
    const searchParams = useSearchParams()

    //null values default to zero when cast to number
    const selectedBoardIndex = Number(searchParams.get("board"))
    let taskId = searchParams.get("task")
        ? Number(searchParams.get("task"))
        : null

    const boards = useQuery(boardsByUserOptions(params.user))

    const task = useQuery(taskByIdOptions(taskId))

    const [isModalOpen, setIsModalOpen, modalMode, setModalMode] = useModal(
        "viewTask",
        false
    )

    const { setNewBoardCreated } = useNewBoardCreated(
        boards.isPending,
        boards.data
    )

    const [showSideBar, setShowSideBar] = useLocalStorage(
        "kanban-show-sidebar",
        true
    )

    //if there is no board search param, route to a board index of 0
    useEffect(() => {
        if (searchParams.get("board") === null) {
            router.push("?board=0")
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

    //if error, open modal to
    //display error modal
    useEffect(() => {
        if (boards.isError) {
            setIsModalOpen(true)
        }
    }, [boards.isError, isModalOpen])

    //set to an empty element since these modals
    //should never be open if taskId is null
    //TODO:
    //  is probably better to account for the situation in which
    //  the url is being manipulated manually
    //    ex. taskId set to a non-valid id
    let modalContent: React.ReactElement = <></>

    if (task.isSuccess && boards.isSuccess) {
        if (modalMode === "viewTask") {
            modalContent = (
                <ViewTaskModal
                    selectedBoardIndex={selectedBoardIndex}
                    columns={boards.data[selectedBoardIndex].columns}
                    task={task.data}
                    setIsModalOpen={setIsModalOpen}
                    setModalMode={setModalMode}
                />
            )
        } else if (modalMode === "editTask") {
            modalContent = (
                <EditTaskModal
                    selectedBoardIndex={selectedBoardIndex}
                    columns={boards.data[selectedBoardIndex].columns}
                    task={task.data}
                    setIsModalOpen={setIsModalOpen}
                    setModalMode={setModalMode}
                />
            )
        } else {
            modalContent = (
                <DeleteModal
                    selectedBoardIndex={selectedBoardIndex}
                    isBoard={false}
                    itemToDelete={task.isSuccess ? task.data : null}
                    changeSelectedBoardIndex={changeSelectedBoardIndex}
                    setIsModalOpen={setIsModalOpen}
                />
            )
        }
    }

    function changeSelectedBoardIndex(index: number) {
        router.push(`?board=${index}`)
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
                flex w-full min-h-screen md:grid md:grid-rows-[1fr_18fr] md:grid-cols-[16.5rem_24fr] md:h-full md:fixed 
                lg:grid-cols-[17rem_3fr] xl:grid-cols-[17rem_6fr]"
            >
                <div
                    className={`hidden md:flex bg-neutral-100 md:dark:bg-neutral-700 md:pl-6 md:border-r-[1px] 
                        md:dark:border-neutral-600 md:border-neutral-300 ${
                            !showSideBar && "md:border-b-[1px]"
                        }`}
                >
                    <Logo />
                </div>
                <div
                    className="
                    flex flex-row fixed top-0 left-0 right-0 bg-neutral-100 dark:bg-neutral-700 pl-3 
                    md:relative md:border-b-[1px] md:dark:border-neutral-600 md:border-neutral-300"
                >
                    <div className="flex flex-row justify-center items-center md:hidden">
                        <Logo />
                    </div>
                    <HeaderBar
                        selectedBoardIndex={selectedBoardIndex}
                        numBoards={boards.isSuccess ? boards.data.length : 0}
                        boards={boards.isSuccess ? boards.data : []}
                        isPending={boards.isPending}
                        changeSelectedBoardIndex={changeSelectedBoardIndex}
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
                        selectedBoardIndex={selectedBoardIndex}
                        boards={boards.isSuccess ? boards.data : []}
                        isPending={boards.isPending}
                    />
                </div>
                <div
                    className={`overflow-auto ${
                        showSideBar ? "col-span-1" : "col-span-2 pl-6"
                    }`}
                >
                    <Board
                        board={
                            boards.isSuccess && boards.data.length > 0
                                ? boards.data[selectedBoardIndex]
                                : null
                        }
                        numBoards={boards.isSuccess ? boards.data.length : 0}
                        isPending={boards.isPending}
                        selectedBoardIndex={selectedBoardIndex}
                        setNewBoardCreated={setNewBoardCreated}
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
                    {!boards.isError ? (
                        modalContent
                    ) : (
                        <ErrorModal
                            refetch={boards.refetch}
                            setIsModalOpen={setIsModalOpen}
                        />
                    )}
                </Modal>
            )}
        </main>
    )
}
