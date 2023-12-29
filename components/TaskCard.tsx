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
    const {
        data: task,
        isPending,
        isError,
        isSuccess,
    } = useQuery(taskByIdOptions(taskId))

    console.log(`task pending? ${isPending}`)
    console.log(`task data ${JSON.stringify(task)}`)

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

    return (
        <>
            <Link href={taskCardHref}>
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
