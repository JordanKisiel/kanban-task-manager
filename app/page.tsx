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
import ModalContent from "@/components/ModalContent"
import showIcon from "@/public/show-icon.svg"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"

export default function Home() {
    const router = useRouter()
    const searchParams = useSearchParams()

    //null values default to zero when cast to number
    const selectedBoardIndex = Number(searchParams.get("board"))
    let taskId =
        searchParams.get("task") !== null
            ? Number(searchParams.get("task"))
            : null

    useEffect(() => {
        if (searchParams.get("board") === null) {
            router.push("?boards=0")
        }
    }, [searchParams.get("board")])

    useEffect(() => {
        if (taskId !== null) {
            console.log(`selected board: ${selectedBoardIndex}`)
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

    const [isDarkMode, toggleDarkMode] = useDarkMode("kanban-isDarkMode")

    const [showSideBar, setShowSideBar] = useLocalStorage(
        "kanban-show-sidebar",
        true
    )

    const { setNewBoardCreated } = useNewBoardCreated()

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
                        selectedBoardIndex={selectedBoardIndex}
                        taskId={taskId}
                        changeSelectedBoardIndex={changeSelectedBoardIndex}
                        setNewBoardCreated={setNewBoardCreated}
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
                        setNewBoardCreated={setNewBoardCreated}
                        selectedBoardIndex={selectedBoardIndex}
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
                        setNewBoardCreated={setNewBoardCreated}
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
                    <ModalContent
                        mode={modalMode}
                        selectedBoardIndex={selectedBoardIndex}
                        taskId={taskId}
                        setModalMode={setModalMode}
                        setIsModalOpen={setIsModalOpen}
                        setNewBoardCreated={setNewBoardCreated}
                        changeSelectedBoardIndex={changeSelectedBoardIndex}
                    />
                </Modal>
            )}
        </main>
    )
}
