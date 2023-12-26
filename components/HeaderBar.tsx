"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import Image from "next/image"
import ActionButton from "./ActionButton"
import MenuButton from "./MenuButton"
import Modal from "./Modal"
import ModalSideBar from "./ModalSideBar"
import addIcon from "../public/plus-icon.svg"
import LoadingText from "./LoadingText"
import { useModal } from "@/hooks/useModal"
import ModalContent from "./ModalContent"
import { testUserId } from "@/testing/testingConsts"
import { allBoardsOptions } from "@/lib/queries"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"

type Props = {
    selectedBoardIndex: number
    taskId: number | null
    changeSelectedBoardIndex: Function
}

export default function HeaderBar({
    selectedBoardIndex,
    taskId,
    changeSelectedBoardIndex,
}: Props) {
    const {
        data: boards,
        isError,
        isPending,
    } = useQuery(allBoardsOptions(testUserId))

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
    ) : boards && boards.length > 0 ? (
        boards[selectedBoardIndex].title
    ) : (
        ""
    )

    const isNoBoards = boards && boards.length === 0
    const isNoColumns =
        isNoBoards ||
        (boards && boards[selectedBoardIndex].columns.length === 0)

    const menuOptions = [
        {
            actionName: "Edit Board",
            action: () => {
                setIsModalOpen(true)
                setModalMode("editBoard")
            },
            isDisabled: boards !== undefined && boards.length === 0,
        },
        {
            actionName: "Delete Board",
            action: () => {
                setIsModalOpen(true)
                setModalMode("deleteBoard")
            },
            isDisabled: boards !== undefined && boards.length === 0,
        },
    ]

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
            {showModalSideBar && (
                <ModalSideBar
                    selectedBoardIndex={selectedBoardIndex}
                    setShowModalSideBar={setShowModalSideBar}
                    setIsModalOpen={setIsModalOpen}
                    setModalMode={setModalMode}
                />
            )}
        </>
    )
}
