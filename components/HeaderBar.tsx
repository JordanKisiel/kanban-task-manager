"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import LoadingText from "./LoadingText"
import { useModal } from "@/hooks/useModal"
import { boardByIdOptions } from "@/lib/queries"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"
import { Board } from "@/types"
import AddTaskModal from "./AddTaskModal"
import EditBoardModal from "./EditBoardModal"
import DeleteModal from "./DeleteModal"
import ActionButton from "./ActionButton"
import MenuButton from "./MenuButton"
import Modal from "./Modal"
import ModalSideBar from "./ModalSideBar"
import Image from "next/image"
import addIcon from "@/public/plus-icon.svg"

type Props = {
    boardId: number
    numBoards: number
    boards: Board[]
    selectedBoardIndex: number
    taskId: number | null
    changeSelectedBoardIndex: Function
    isDarkMode: boolean
    toggleDarkMode: Function
}

export default function HeaderBar({
    boardId,
    numBoards,
    boards,
    selectedBoardIndex,
    taskId,
    changeSelectedBoardIndex,
    isDarkMode,
    toggleDarkMode,
}: Props) {
    const {
        data: board,
        isError,
        isPending,
    } = useQuery(boardByIdOptions(boardId))

    const { setNewBoardCreated } = useNewBoardCreated(isPending, boards)

    const [isModalOpen, setIsModalOpen, modalMode, setModalMode] = useModal(
        "addTask",
        false
    )

    const [showModalSideBar, setShowModalSideBar] = useState(false)

    const selectedBoardTitle = isPending ? (
        <LoadingText
            text="Loading Title"
            ellipsisLength={4}
            ellipsisSpeedInSec={0.7}
        />
    ) : (
        board?.title
    )

    const isNoBoards = numBoards === 0
    const isNoColumns =
        isNoBoards || (board ? board.columns.length === 0 : true)

    const menuOptions = [
        {
            actionName: "Edit Board",
            action: () => {
                setIsModalOpen(true)
                setModalMode("editBoard")
            },
            isDisabled: numBoards === 0,
        },
        {
            actionName: "Delete Board",
            action: () => {
                setIsModalOpen(true)
                setModalMode("deleteBoard")
            },
            isDisabled: numBoards === 0,
        },
    ]

    let modalContent: React.ReactElement

    if (modalMode === "addTask") {
        modalContent = (
            <AddTaskModal
                columns={board.columns}
                setIsModalOpen={setIsModalOpen}
            />
        )
    } else if (modalMode === "editTask") {
        modalContent = (
            <EditBoardModal
                board={board}
                selectedBoardIndex={selectedBoardIndex}
                setIsModalOpen={setIsModalOpen}
            />
        )
    } else {
        modalContent = (
            <DeleteModal
                isBoard={true}
                itemToDelete={board}
                changeSelectedBoardIndex={changeSelectedBoardIndex}
                selectedBoardIndex={selectedBoardIndex}
                setIsModalOpen={setIsModalOpen}
            />
        )
    }

    return (
        <>
            <section className="bg-neutral-100 dark:bg-neutral-700 flex flex-row p-4 justify-between items-center w-full">
                <div className="relative pr-4">
                    <h1 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                        {selectedBoardTitle}
                    </h1>
                    <button
                        onClick={(e) => setShowModalSideBar(true)}
                        className={`absolute w-full h-full top-0 bg-no-repeat bg-right ${
                            showModalSideBar
                                ? "bg-[url('../public/arrow-up.svg')]"
                                : "bg-[url('../public/arrow-down.svg')]"
                        } md:hidden md:bg-none`}
                    ></button>
                </div>
                <div className="flex items-center">
                    <ActionButton
                        isWidthFull={false}
                        bgColor="bg-purple-600"
                        textColor="text-neutral-100 dark:text-neutral-100"
                        textSize="text-base"
                        isDisabled={isNoBoards || isNoColumns}
                        handler={() => {
                            setIsModalOpen(true)
                            setModalMode("addTask")
                        }}
                    >
                        <Image
                            className="md:w-[0.65rem] md:mt-[0.2rem]"
                            src={addIcon}
                            alt="add icon"
                            width={12}
                            height={12}
                        />
                        <span className="hidden md:inline-block">
                            Add New Task
                        </span>
                    </ActionButton>
                    <MenuButton actions={menuOptions} />
                </div>
            </section>
            {isModalOpen && (
                <Modal
                    selectedBoardIndex={selectedBoardIndex}
                    setIsModalOpen={setIsModalOpen}
                >
                    {modalContent}
                </Modal>
            )}
            {showModalSideBar && (
                <ModalSideBar
                    selectedBoardIndex={selectedBoardIndex}
                    setShowModalSideBar={setShowModalSideBar}
                    boards={boards}
                    changeSelectedBoardIndex={changeSelectedBoardIndex}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    isPending={isPending}
                    taskId={taskId}
                />
            )}
        </>
    )
}
