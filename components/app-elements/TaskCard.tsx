"use client"

import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import Link from "next/link"
import { usePathname } from "next/navigation"
import GrabIcon from "@/components/icons/GrabIcon"
import { useDarkMode } from "@/contexts/DarkModeProvider"
import { Task } from "@/types"
import Image from "next/image"
import dragPadDark from "@/public/drag-pad-dark.svg"

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
        <div
            ref={setNodeRef}
            style={style}
            className="
                        flex flex-row justify-between bg-neutral-100 dark:bg-neutral-700 rounded
                        shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none hover:bg-neutral-200 
                      dark:hover:bg-neutral-600"
        >
            <Link
                href={taskCardHref}
                className="w-[80%] py-5 px-5"
            >
                <div>
                    <h4 className="font-bold dark:text-neutral-100">
                        {task.title}
                    </h4>
                    <span className="text-xs font-bold text-neutral-500">
                        {`${completedSubTasks} of ${task.subTasks.length} subtasks`}
                    </span>
                </div>
            </Link>
            <div
                {...attributes}
                {...listeners}
                className={`flex flex-col justify-center items-center px-3 ${
                    dragDisabled ? "cursor-default" : "cursor-grab"
                }`}
            >
                <Image
                    src={dragPadDark}
                    alt="drag pad"
                    width={30}
                />
            </div>
        </div>
    )
}
