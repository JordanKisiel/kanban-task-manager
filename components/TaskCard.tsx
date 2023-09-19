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
            <div
                key={title}
                className="bg-neutral-700 rounded py-5 px-4"
            >
                <h4 className="font-bold text-neutral-100">{title}</h4>
                <span className="text-xs font-bold text-neutral-500">{`0 of ${numSubtasks} subtasks`}</span>
            </div>
        </Link>
    )
}
