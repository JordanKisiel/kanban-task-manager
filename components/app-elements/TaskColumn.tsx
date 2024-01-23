import { useQuery } from "@tanstack/react-query"
import TaskCard from "./TaskCard"
import { tasksByColumnOptions } from "@/lib/queries"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"

type Props = {
    selectedBoardIndex: number
    columnId: number
    columnTitle: string
    taskOrdering: number[]
    columnColor: string
}

export default function TaskColumn({
    selectedBoardIndex,
    columnId,
    columnTitle,
    taskOrdering,
    columnColor,
}: Props) {
    const {
        data: tasks,
        isPending,
        isError,
        isSuccess,
    } = useQuery(tasksByColumnOptions(columnId, taskOrdering))

    const taskCards = isSuccess
        ? tasks.map((task) => {
              return (
                  <TaskCard
                      key={`${task.id}`}
                      selectedBoardIndex={selectedBoardIndex}
                      taskId={task.id}
                  />
              )
          })
        : []

    // const { setNodeRef, isOver } = useDroppable({
    //     id: columnId,
    //     data: {
    //         type: "Column",
    //     },
    // })

    return (
        <div>
            <div className="flex flex-row items-center gap-3 mb-4">
                <div
                    className={`${columnColor} w-[1rem] h-[1rem] rounded-full`}
                ></div>
                <h3
                    className="
                    text-[0.82rem] uppercase tracking-[0.12em] text-neutral-500 font-bold"
                >
                    {`${columnTitle} (${isSuccess ? tasks.length : 0})`}
                </h3>
            </div>
            <div className="flex flex-col gap-6">
                <SortableContext
                    items={taskOrdering}
                    strategy={verticalListSortingStrategy}
                >
                    {taskCards}
                </SortableContext>
            </div>
        </div>
    )
}
