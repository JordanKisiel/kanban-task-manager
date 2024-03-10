"use client"

import { taskByIdOptions } from "@/lib/queries"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"
import GrabIcon from "@/components/icons/GrabIcon"
import { useDarkMode } from "@/contexts/DarkModeProvider"
import { Task } from "@/types"

type Props = {
    task: Task
    selectedBoardIndex: number
    dragDisabled: boolean
}

export default function TaskCard({
    task,
    selectedBoardIndex,
    dragDisabled,
}: Props) {
    const {
        setNodeRef,
        attributes,
        listeners,
        transform,
        transition,
        isDragging,
    } = useSortable({
        id: task.id,
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

    const { isDarkMode } = useDarkMode()

    const completedSubTasks = task.subTasks.reduce((accum, curr) => {
        if (curr.isComplete) {
            accum += 1
        }
        return accum
    }, 0)

    const pathname = usePathname()

    const taskCardHref = `${pathname}?board=${selectedBoardIndex}&task=${task.id}`

    //represents the UI of the TaskCard copy that moves within
    //the draggable area in the background when user is dragging
    //the chosen task in the foreground
    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 
                             shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none border-2 
                           border-purple-600 opacity-40"
            >
                <h4 className="font-bold dark:text-neutral-100">
                    {task.title}
                </h4>
                <span className="text-xs font-bold text-neutral-500">{`${completedSubTasks} of ${task.subTasks.length} subtasks`}</span>
            </div>
        )
    }

    return (
        <>
            <Link
                ref={setNodeRef}
                style={style}
                href={taskCardHref}
            >
                <div
                    className="
                flex flex-row justify-between bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 
                shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none"
                >
                    <div>
                        <h4 className="font-bold dark:text-neutral-100">
                            {task.title}
                        </h4>
                        <span className="text-xs font-bold text-neutral-500">
                            {`${completedSubTasks} of ${task.subTasks.length} subtasks`}
                        </span>
                    </div>
                    <div
                        {...attributes}
                        {...listeners}
                        className={`opacity-40 h-1/2 px-2 pt-1 pb-3 ${
                            dragDisabled ? "cursor-default" : "cursor-grab"
                        }`}
                    >
                        <GrabIcon
                            fill={isDarkMode ? "#FFFFFF" : "#000000"}
                            scale={0.1}
                            isLoading={dragDisabled}
                        />
                    </div>
                </div>
            </Link>
        </>
    )
}
