import { Task } from "../types"

type Props = {
    task: Task
}

export default function ViewTaskModal({ task }: Props) {
    return (
        <div className="bg-neutral-900/70 absolute flex flex-col items-center inset-0 pt-[5rem]">
            <div className="bg-neutral-700 py-4 w-3/4 gap-3 rounded-lg shadow-[0_10px_20px_0_rgba(54,78,126,0.25)]">
                View Task Modal Test
            </div>
        </div>
    )
}
