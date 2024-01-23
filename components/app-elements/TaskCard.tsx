"use client"

import { taskByIdOptions } from "@/lib/queries"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
    selectedBoardIndex: number
    taskId: number
    dragDisabled: boolean
}

export default function TaskCard({
    selectedBoardIndex,
    taskId,
    dragDisabled,
}: Props) {
    const {
        data: task,
        isPending,
        isError,
        isSuccess,
    } = useQuery(taskByIdOptions(taskId))

    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: taskId,
        data: {
            type: "Task",
            task: task ?? null,
        },
        disabled: dragDisabled,
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform),
    }

    const completedSubTasks = isSuccess
        ? task.subTasks.reduce((accum, curr) => {
              if (curr.isComplete) {
                  accum += 1
              }
              return accum
          }, 0)
        : 0

    const pathname = usePathname()

    const taskCardHref = isSuccess
        ? `${pathname}?board=${selectedBoardIndex}&task=${task.id}`
        : `#`

    //represents the UI of the TaskCard copy that moves within
    //the draggable area in the background when user is dragging
    //the chosen task in the foreground
    //content is still rendered but visually hidden to maintain
    //the vertical size of the task card copy
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 
                             shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none border-2 
                           border-purple-600 opacity-40"
            >
                <h4 className="font-bold dark:text-neutral-100 invisible">
                    {isSuccess ? task.title : ""}
                </h4>
                <span className="text-xs font-bold text-neutral-500 invisible">{`${completedSubTasks} of ${
                    isSuccess ? task.subTasks.length : 0
                } subtasks`}</span>
            </div>
        )
    }

    return (
        <>
            <Link
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                href={taskCardHref}
            >
                <div
                    className="
                bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 
                shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none"
                >
                    <h4 className="font-bold dark:text-neutral-100">
                        {isSuccess ? task.title : ""}
                    </h4>
                    <span className="text-xs font-bold text-neutral-500">{`${completedSubTasks} of ${
                        isSuccess ? task.subTasks.length : 0
                    } subtasks`}</span>
                </div>
            </Link>
        </>
    )
}
