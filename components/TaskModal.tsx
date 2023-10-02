import { Task } from "../types"
import ViewTaskModal from "./ViewTaskModal"
import AddTaskModal from "./AddTaskModal"

type Props = {
    task: Task
    otherColumns: string[]
    currentColumn: string
    columnNames: string[]
    handleBackToBoard: Function
}

export default function TaskModal({
    task,
    otherColumns,
    currentColumn,
    columnNames,
    handleBackToBoard,
}: Props) {
    //TODO:
    //  -create and style the other modals
    //  -add some logic that changes between different task modals (view, edit, delete)
    //  -follow prisma tutorial
    //  -add CRUD operations for boards and tasks

    return (
        <div
            onClick={() => handleBackToBoard()}
            className="bg-neutral-900/70 absolute flex flex-col items-center inset-0 justify-center px-4 py-12"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-700 px-6 pt-6 pb-8 w-full gap-3 rounded-lg shadow-[0_10px_20px_0_rgba(54,78,126,0.25)] overflow-auto overflow-y-scroll overscroll-contain"
            >
                <AddTaskModal columnNames={columnNames} />
            </div>
        </div>
    )
}
