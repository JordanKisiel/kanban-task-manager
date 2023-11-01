import { useState } from "react"
import ViewTaskModal from "./ViewTaskModal"
import EditTaskModal from "./EditTaskModal"
import DeleteModal from "./DeleteModal"
import AddTaskModal from "./AddTaskModal"
import AddBoardModal from "./AddBoardModal"
import EditBoardModal from "./EditBoardModal"
import { Task } from "@/types"

type ModalMode =
    | "viewTask"
    | "editTask"
    | "deleteTask"
    | "addTask"
    | "addBoard"
    | "editBoard"
    | "deleteBoard"

type Props = {
    mode: ModalMode
    selectedBoardIndex?: number
    task?: Task
    currentColumn?: string | null
    otherColumns?: string[]
}

export default function ModalContent({
    mode,
    selectedBoardIndex,
    task,
    currentColumn,
    otherColumns,
}: Props) {
    const [modalMode, setModalMode] = useState<ModalMode>(mode)

    function handleBackToBoard() {
        setModalMode("viewTask")
        setIsModalOpen(false)
    }

    const content: Map<ModalMode, JSX.Element> = new Map([
        [
            "viewTask",
            <ViewTaskModal
                task={task ? task : null}
                otherColumns={otherColumns ? otherColumns : []}
                currentColumn={currentColumn ? currentColumn : null}
                setModalMode={setModalMode}
                handleBackToBoard={handleBackToBoard}
            />,
        ],
        [
            "addTask",
            <AddTaskModal
                selectedBoardIndex={selectedBoardIndex ? selectedBoardIndex : 0}
                handleBackToBoard={handleBackToBoard}
            />,
        ],
        [
            "editTask",
            <EditTaskModal
                task={task ? task : null}
                otherColumns={otherColumns ? otherColumns : []}
                currentColumn={currentColumn ? currentColumn : null}
                setModalMode={setModalMode}
                handleBackToBoard={handleBackToBoard}
            />,
        ],
        [
            "deleteTask",
            <DeleteModal
                isBoard={false}
                selectedBoardIndex={selectedBoardIndex ? selectedBoardIndex : 0}
                handleBackToBoard={handleBackToBoard}
            />,
        ],
        ["addBoard", <AddBoardModal handleBackToBoard={handleBackToBoard} />],
        [
            "editBoard",
            <EditBoardModal
                selectedBoardIndex={selectedBoardIndex ? selectedBoardIndex : 0}
                handleBackToBoard={handleBackToBoard}
            />,
        ],
        [
            "deleteBoard",
            <DeleteModal
                isBoard={true}
                selectedBoardIndex={selectedBoardIndex ? selectedBoardIndex : 0}
                handleBackToBoard={handleBackToBoard}
            />,
        ],
    ])

    return content.get(modalMode)
}
