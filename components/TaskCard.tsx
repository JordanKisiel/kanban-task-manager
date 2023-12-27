"use client"

import { taskByIdOptions } from "@/lib/queries"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
    selectedBoardIndex: number
    taskId: number
}

export default function TaskCard({ selectedBoardIndex, taskId }: Props) {
    const { data: task, isPending, isError } = useQuery(taskByIdOptions(taskId))

    const completedSubTasks = task.subTasks.reduce((accum, curr) => {
        if (curr.isComplete) {
            accum += 1
        }
        return accum
    }, 0)

    const pathname = usePathname()

    return (
        <>
            <Link
                href={`${pathname}?board=${selectedBoardIndex}&task=${task.id}`}
            >
                <div
                    className="
                bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 
                shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none"
                >
                    <h4 className="font-bold dark:text-neutral-100">
                        {task.title}
                    </h4>
                    <span className="text-xs font-bold text-neutral-500">{`${completedSubTasks} of ${task.subTasks.length} subtasks`}</span>
                </div>
            </Link>
        </>
    )
}
