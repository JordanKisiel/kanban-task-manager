import { Task } from "../types"
import TaskCard from "./TaskCard"

type Props = {
    selectedBoardIndex: number
    columnIndex: number
    title: string
    tasks: Task[]
    changeSelectedBoardIndex: Function
    setNewBoardCreated: Function
}

export default function TaskColumn({
    selectedBoardIndex,
    columnIndex,
    title,
    tasks,
    changeSelectedBoardIndex,
    setNewBoardCreated,
}: Props) {
    //TODO: replace with function that produces new colors as needed
    const columnColors = ["bg-[#49C4E5]", "bg-[#8471F2]", "bg-[#67E2AE]"]

    const taskCards = tasks.map(({ title, subTasks }, index) => {
        const completedSubTasks = subTasks.reduce((accum, curr) => {
            if (curr.isComplete) {
                accum += 1
            }
            return accum
        }, 0)

        return (
            <TaskCard
                key={`${columnIndex}_${index}`}
                selectedBoardIndex={selectedBoardIndex}
                columnIndex={columnIndex}
                taskIndex={index}
                title={title}
                completedSubTasks={completedSubTasks}
                totalSubTasks={subTasks.length > 0 ? subTasks.length : 0}
                changeSelectedBoardIndex={changeSelectedBoardIndex}
                setNewBoardCreated={setNewBoardCreated}
            />
        )
    })

    return (
        <div>
            <div className="flex flex-row items-center gap-3 mb-4">
                <div
                    className={`${columnColors[columnIndex]} w-[1rem] h-[1rem] rounded-full`}
                ></div>
                <h3
                    className="
                    text-[0.82rem] uppercase tracking-[0.12em] text-neutral-500 font-bold"
                >
                    {`${title} (${tasks.length})`}
                </h3>
            </div>
            <div className="flex flex-col gap-6">{taskCards}</div>
        </div>
    )
}
