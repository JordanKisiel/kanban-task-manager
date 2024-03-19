import { useQuery } from "@tanstack/react-query"
import TaskCard from "./TaskCard"
import { tasksByColumnOptions } from "@/lib/queries"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useDroppable } from "@dnd-kit/core"
import { truncate } from "@/lib/utils"
import { MAX_COLUMN_TITLE_LENGTH, NUM_TRUNCATION_ELLIPSIS } from "@/lib/config"

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

    const taskCards = isSuccess
        ? tasks.map((task) => {
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
                    {`${truncate(
                        columnTitle,
                        MAX_COLUMN_TITLE_LENGTH,
                        NUM_TRUNCATION_ELLIPSIS
                    )} (${isSuccess ? tasks.length : 0})`}
                </h3>
            </div>
            <div
                ref={setNodeRef}
                className={`h-full rounded border border-dashed ${
                    isDragging
                        ? "border-neutral-400 dark:border-neutral-600"
                        : "border-neutral-200 dark:border-neutral-800"
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
