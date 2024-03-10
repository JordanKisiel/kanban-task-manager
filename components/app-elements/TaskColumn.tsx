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
    dragDisabled: boolean
    isDragging: boolean
}

export default function TaskColumn({
    selectedBoardIndex,
    columnId,
    columnTitle,
    taskOrdering,
    columnColor,
    dragDisabled,
    isDragging,
}: Props) {
    const {
        data: tasks,
        isPending,
        isError,
        isSuccess,
    } = useQuery(tasksByColumnOptions(columnId, taskOrdering))

    const { setNodeRef } = useDroppable({
        id: columnId,
        data: {
            type: "Column",
            tasks: tasks ?? null,
        },
    })

    // const sortedTasks = isSuccess
    //     ? tasks.toSorted((a, b) => {
    //           return taskOrdering.indexOf(a.id) - taskOrdering.indexOf(b.id)
    //       })
    //     : []

    const taskCards = isSuccess
        ? tasks.map((task) => {
              // console.log(columnId)
              // console.log(JSON.stringify(task))
              return (
                  <TaskCard
                      key={`${task.id}`}
                      task={task}
                      selectedBoardIndex={selectedBoardIndex}
                      dragDisabled={dragDisabled}
                  />
              )
          })
        : []

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
            <div
                ref={setNodeRef}
                className={`h-full rounded ${
                    isDragging && "border border-neutral-600 border-dashed"
                }`}
            >
                <div className="flex flex-col gap-6">
                    <SortableContext
                        items={tasks ?? []}
                        strategy={verticalListSortingStrategy}
                    >
                        {taskCards}
                    </SortableContext>
                </div>
            </div>
        </div>
    )
}
