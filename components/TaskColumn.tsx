import { Task } from "../types"
import TaskCard from "./TaskCard"

type Props = {
    columnIndex: number
    title: string
    tasks: Task[]
}

export default function TaskColumn({ columnIndex, title, tasks }: Props) {
    const columnColors = ["bg-[#49C4E5]", "bg-[#8471F2]", "bg-[#67E2AE]"]

    const taskCards = tasks.map(({ title, subTasks }, index) => {
        return (
            <TaskCard
                key={`${columnIndex}_${index}`}
                columnIndex={columnIndex}
                taskIndex={index}
                title={title}
                numSubtasks={subTasks.length > 0 ? subTasks.length : 0}
            />
        )
    })

    return (
        <div>
            <div className="flex flex-row items-center gap-3 mb-4">
                <div
                    className={`${columnColors[columnIndex]} w-[1rem] h-[1rem] rounded-full`}
                ></div>
                <h3 className="text-[0.82rem] uppercase tracking-[0.12em] text-neutral-500 font-bold">{`${title} (${tasks.length})`}</h3>
            </div>
            <div className="flex flex-col gap-6">{taskCards}</div>
        </div>
    )
}
