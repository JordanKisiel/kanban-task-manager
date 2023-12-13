"use client"

import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useDarkMode } from "@/hooks/useDarkMode"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import Image from "next/image"
import Logo from "@/components/Logo"
import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"
import SideBar from "../components/SideBar"
import showIcon from "@/public/show-icon.svg"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"
import { useUrlIndices } from "@/hooks/useUrlIndices"

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | undefined }
}

export default function Home({ searchParams }: Props) {
    const router = useRouter()

    useEffect(() => {
        if (!searchParams.board) {
            router.push("?boards=0")
        }
    }, [searchParams.board])

    const {
        selectedBoardIndex,
        columnIndex,
        taskIndex,
        changeSelectedBoardIndex,
    } = useUrlIndices()

    const [isDarkMode, toggleDarkMode] = useDarkMode("kanban-isDarkMode")

    const [showSideBar, setShowSideBar] = useLocalStorage(
        "kanban-show-sidebar",
        true
    )

    const { setNewBoardCreated } = useNewBoardCreated()

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
                        columnIndex={columnIndex}
                        taskIndex={taskIndex}
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
                        columnIndex={columnIndex}
                        taskIndex={taskIndex}
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
                        columnIndex={columnIndex}
                        selectedBoardIndex={selectedBoardIndex}
                        taskIndex={taskIndex}
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
        </main>
    )
}
