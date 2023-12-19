"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

type Props = {
    selectedBoardIndex: number
    taskId: number
    title: string
    completedSubTasks: number
    totalSubTasks: number
}

export default function TaskCard({
    selectedBoardIndex,
    taskId,
    title,
    completedSubTasks,
    totalSubTasks,
}: Props) {
    const pathname = usePathname()

    return (
        <>
            <Link
                href={`${pathname}?board=${selectedBoardIndex}&task=${taskId}`}
            >
                <div
                    className="
                bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 
                shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none"
                >
                    <h4 className="font-bold dark:text-neutral-100">{title}</h4>
                    <span className="text-xs font-bold text-neutral-500">{`${completedSubTasks} of ${totalSubTasks} subtasks`}</span>
                </div>
            </Link>
        </>
    )
}
