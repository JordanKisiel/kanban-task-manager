"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Modal from "./Modal"
import ModalContent from "./ModalContent"
import { ModalMode } from "@/types"

type Props = {
    selectedBoardIndex: number
    columnIndex: number
    taskIndex: number
    title: string
    numSubtasks: number
}

export default function TaskCard({
    selectedBoardIndex,
    columnIndex,
    taskIndex,
    title,
    numSubtasks,
}: Props) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [modalMode, setModalMode] =
        useState<Extract<ModalMode, "viewTask" | "editTask" | "deleteTask">>(
            "viewTask"
        )

    const pathname = usePathname()

    return (
        <>
            <Link
                href={`${pathname}?board=${selectedBoardIndex}&task=${columnIndex}_${taskIndex}`}
            >
                <div
                    onClick={() => {
                        setModalMode("viewTask")
                        setIsModalOpen(true)
                    }}
                    className="
                bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 
                shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none"
                >
                    <h4 className="font-bold dark:text-neutral-100">{title}</h4>
                    <span className="text-xs font-bold text-neutral-500">{`0 of ${numSubtasks} subtasks`}</span>
                </div>
            </Link>
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
                    />
                </Modal>
            )}
        </>
    )
}
