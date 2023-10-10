"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"

type Props = {
    columnIndex: number
    taskIndex: number
    title: string
    numSubtasks: number
}

export default function TaskCard({
    columnIndex,
    taskIndex,
    title,
    numSubtasks,
}: Props) {
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const selectedBoardIndex = Number(searchParams.get("board"))

    return (
        <Link
            href={`${pathname}?board=${selectedBoardIndex}&task=${columnIndex}_${taskIndex}`}
        >
            <div className="bg-neutral-100 dark:bg-neutral-700 rounded py-5 px-4 shadow-[0_4px_6px_0_rgba(54,78,126,0.10)] dark:shadow-none">
                <h4 className="font-bold dark:text-neutral-100">{title}</h4>
                <span className="text-xs font-bold text-neutral-500">{`0 of ${numSubtasks} subtasks`}</span>
            </div>
        </Link>
    )
}
