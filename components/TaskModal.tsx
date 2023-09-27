import { Task } from "../types"
import ViewTaskModal from "./ViewTaskModal"

type Props = {
    task: Task
    otherColumns: string[]
    currentColumn: string
    handleBackToBoard: Function
}

export default function TaskModal({
    task,
    otherColumns,
    currentColumn,
    handleBackToBoard,
}: Props) {
    //TODO:
    //  add some logic that changes between different task modals (view, edit, delete)

    return (
        <div
            onClick={() => handleBackToBoard()}
            className="bg-neutral-900/70 absolute flex flex-col items-center inset-0 justify-center px-4"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-700 px-6 pt-6 pb-8 w-full gap-3 rounded-lg shadow-[0_10px_20px_0_rgba(54,78,126,0.25)]"
            >
                <ViewTaskModal
                    task={task}
                    otherColumns={otherColumns}
                    currentColumn={currentColumn}
                    handleBackToBoard={handleBackToBoard}
                />
            </div>
        </div>
    )
}
