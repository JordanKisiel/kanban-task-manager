import { Task } from "../types"
import ViewTaskModal from "./ViewTaskModal"

type Props = {
    task: Task
    otherColumns: string[]
    currentColumn: string
}

export default function TaskModal({
    task,
    otherColumns,
    currentColumn,
}: Props) {
    //TODO:
    //  add some logic that changes between different task modals (view, edit)

    return (
        <div className="bg-neutral-900/70 absolute flex flex-col items-center inset-0 justify-center px-4">
            <div className="bg-neutral-700 px-6 pt-6 pb-8 w-full gap-3 rounded-lg shadow-[0_10px_20px_0_rgba(54,78,126,0.25)]">
                <ViewTaskModal
                    task={task}
                    otherColumns={otherColumns}
                    currentColumn={currentColumn}
                />
            </div>
        </div>
    )
}
