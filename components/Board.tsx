"use client"

import Image from "next/image"
import TaskColumn from "./TaskColumn"
import Modal from "./Modal"
import ModalContent from "./ModalContent"
import ActionButton from "./ActionButton"
import addIconDark from "../public/plus-icon.svg"
import addIconLight from "../public/plus-icon-gray.svg"
import { useBoards } from "@/lib/dataUtils"
import { useModal } from "@/hooks/useModal"
import { testUserId } from "@/testing/testingConsts"

type Props = {
    isDarkMode: boolean
    setNewBoardCreated: Function
    selectedBoardIndex: number
    columnIndex: number
    taskIndex: number
    changeSelectedBoardIndex: Function
}

export default function Board({
    isDarkMode,
    setNewBoardCreated,
    selectedBoardIndex,
    columnIndex,
    taskIndex,
    changeSelectedBoardIndex,
}: Props) {
    const { boards, isLoading, isError, mutate } = useBoards(testUserId)

    const [isModalOpen, setIsModalOpen, modalMode, setModalMode] = useModal(
        "editBoard",
        false
    )

    const columns =
        isLoading || boards.length === 0
            ? []
            : boards[selectedBoardIndex].columns

    const taskColumns = columns.map((column, index) => {
        return (
            <TaskColumn
                key={column.title}
                selectedBoardIndex={selectedBoardIndex}
                columnIndex={index}
                title={column.title}
                tasks={column.tasks}
                changeSelectedBoardIndex={changeSelectedBoardIndex}
                setNewBoardCreated={setNewBoardCreated}
            />
        )
    })

    const board = (
        <div className="grid grid-flow-col auto-cols-[16rem] px-6 py-20 gap-6 overflow-auto md:pt-5 md:pb-20">
            {taskColumns}
            <div className="flex flex-col pt-[2.3rem] h-full justify-center">
                <button
                    onClick={() => {
                        setIsModalOpen(true)
                        setModalMode("editBoard")
                    }}
                    className="
                        flex flex-row text-neutral-500 dark:text-neutral-400 bg-neutral-300/50 
                        dark:bg-neutral-700/20 text-2xl font-bold items-center gap-2 w-full h-full 
                        justify-center rounded"
                >
                    <Image
                        className="mt-[0.5rem] opacity-50"
                        src={isDarkMode ? addIconDark : addIconLight}
                        alt="Add icon"
                        width={12}
                        height={12}
                    />
                    New Column
                </button>
            </div>
        </div>
    )

    const emptyBoard = (
        <div className="flex flex-col grow items-center min-h-fit justify-center w-full h-full">
            <div className="flex flex-col items-center">
                <p className="text-neutral-500 text-center w-[80%] text-lg font-bold leading-6 mb-6 -mt-12">
                    This board is empty. Create a new column to get started.
                </p>
                <ActionButton
                    isWidthFull={false}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => {
                        setIsModalOpen(true)
                        setModalMode("editBoard")
                    }}
                >
                    <Image
                        className="w-[5%] mt-[0.2rem]"
                        src={isDarkMode ? addIconDark : addIconLight}
                        alt="Add icon"
                        width={12}
                        height={12}
                    />
                    <span>Add New Column</span>
                </ActionButton>
            </div>
        </div>
    )

    const newUserPrompt = (
        <div className="flex flex-col grow items-center min-h-fit justify-center w-full h-full">
            <div className="flex flex-col items-center">
                <p className="text-neutral-500 text-center w-[80%] text-lg font-bold leading-6 mb-6 -mt-12">
                    You don't seem to have any boards. Try creating one!
                </p>
                <ActionButton
                    isWidthFull={false}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => {
                        setIsModalOpen(true)
                        setModalMode("addBoard")
                    }}
                >
                    <Image
                        className="w-[5%] mt-[0.2rem]"
                        src={isDarkMode ? addIconDark : addIconLight}
                        alt="Add icon"
                        width={12}
                        height={12}
                    />
                    <span>Create New Board</span>
                </ActionButton>
            </div>
        </div>
    )

    let content: React.ReactNode
    if (boards.length === 0) {
        content = newUserPrompt
    } else if (columns.length === 0) {
        content = emptyBoard
    } else {
        content = board
    }

    return (
        <>
            {content}
            {isModalOpen && (
                <Modal
                    selectedBoardIndex={selectedBoardIndex}
                    setIsModalOpen={setIsModalOpen}
                >
                    <ModalContent
                        mode={modalMode}
                        selectedBoardIndex={selectedBoardIndex}
                        columnIndex={columnIndex}
                        taskIndex={taskIndex}
                        setModalMode={setModalMode}
                        setIsModalOpen={setIsModalOpen}
                        setNewBoardCreated={setNewBoardCreated}
                        changeSelectedBoardIndex={changeSelectedBoardIndex}
                    />
                </Modal>
            )}
        </>
    )
}
