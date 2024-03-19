"use client"

import SubtaskCard from "@/components/app-elements/SubtaskCard"
import MenuButton from "@/components/ui-elements/MenuButton"
import ModalHeader from "@/components/modals/ModalHeader"
import ModalLabel from "@/components/modals/ModalLabel"
import { Column } from "@/types"
import { Task } from "@/types"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editTask } from "@/lib/dataUtils"

type Props = {
    selectedBoardIndex: number
    task: Task
    columns: Column[]
    setModalMode: Function
    setIsModalOpen: Function
}

type FormData = {
    title: string
    description: string
    subTasks: {
        create: string[]
        update: {
            id: number
            description: string
            isComplete: boolean
        }[]
        delete: {
            id: number
        }[]
    }
    columnId: number | null
}
export default function ViewTaskModal({
    selectedBoardIndex,
    task,
    columns,
    setModalMode,
    setIsModalOpen,
}: Props) {
    const router = useRouter()

    const queryClient = useQueryClient()

    const editTaskMutation = useMutation({
        mutationFn: editTask,
        onMutate: async (sentTaskData) => {
            //change shape of data to conform to Task type
            const newTask = {
                id: sentTaskData.taskId,
                title: sentTaskData.title,
                description: sentTaskData.description,
                subTasks: [...sentTaskData.subTasks.update],
                columnId: sentTaskData.columnId,
            }

            //cancel outgoing refetches to stop
            //overwriting of optimistic update
            await queryClient.cancelQueries({ queryKey: ["tasksData"] })
            await queryClient.cancelQueries({
                queryKey: ["taskData", newTask.id],
            })

            //snapshot the previous value
            const previousTask = queryClient.getQueryData([
                "taskData",
                newTask.id,
            ])

            //optimistically update local cache to new task values
            queryClient.setQueryData(["taskData", newTask.id], newTask)

            //return context
            return { previousTask, newTask }
        },
        // if mutation fails, use context returned from onMutate
        onError: (err, newTask, context) => {
            console.log(err)
            if (context) {
                queryClient.setQueryData(
                    ["taskData", context.newTask.id],
                    context.previousTask
                )
            }
        },
        //re-fetch regardless of error or success
        onSettled: (newTask) => {
            queryClient.invalidateQueries({ queryKey: ["boardsData"] })
            queryClient.invalidateQueries({ queryKey: ["tasksData"] })
            queryClient.invalidateQueries({
                queryKey: ["taskData", newTask.id],
            })
        },
    })

    const numCompletedTasks = task.subTasks.reduce((accum, curr) => {
        const valueToAdd = curr.isComplete ? 1 : 0
        return accum + valueToAdd
    }, 0)

    const subTaskCards = task.subTasks.map((subTask, index) => {
        return (
            <SubtaskCard
                key={subTask.id}
                subtask={subTask}
                handleCheck={() => handleCheck(index)}
            />
        )
    })

    const currentColumn =
        task.columnId === null
            ? []
            : columns.filter((column) => {
                  return column.id === task.columnId
              })

    const otherColumns =
        task.columnId === null
            ? []
            : columns.filter((column) => {
                  return column.id !== task.columnId
              })

    const columnOptions = [...currentColumn, ...otherColumns]

    const selectOptions = columnOptions.map((columnOption) => {
        return (
            <option
                key={columnOption.id}
                value={columnOption.title ? columnOption.title : ""}
                id={`${columnOption.id}`}
            >
                {columnOption.title}
            </option>
        )
    })

    const menuOptions = [
        {
            actionName: "Edit",
            action: () => setModalMode("editTask"),
            isDisabled: false,
        },
        {
            actionName: "Delete",
            action: () => setModalMode("deleteTask"),
            isDisabled: false,
        },
        {
            actionName: "Close",
            action: () => {
                setIsModalOpen(false)
                router.push(`?board=${selectedBoardIndex}`)
            },
            isDisabled: false,
        },
    ]

    function handleCheck(inputIndex: number) {
        editTaskMutation.mutate({
            taskId: task.id,
            title: task.title,
            description: task.description,
            subTasks: {
                create: [],
                update: task.subTasks.map((subTask, index) => {
                    if (inputIndex === index) {
                        return {
                            ...subTask,
                            isComplete: !subTask.isComplete,
                        }
                    } else {
                        return subTask
                    }
                }),
                delete: [],
            },
            columnId: task.columnId,
        })
    }

    function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedOptionIndex = event.target.options.selectedIndex

        editTaskMutation.mutate({
            taskId: task.id,
            title: task.title,
            description: task.description,
            subTasks: {
                create: [],
                update: [...task.subTasks],
                delete: [],
            },
            columnId: Number(event.target.options[selectedOptionIndex].id),
        })
    }

    return (
        <form>
            <div className="flex flex-row mb-6 justify-between items-start">
                <ModalHeader>{task.title}</ModalHeader>

                <MenuButton actions={menuOptions} />
            </div>
            <p className="text-neutral-500 text-sm leading-6 mb-6">
                {task.description}
            </p>
            <div className="mb-5">
                <span
                    className="
                text-neutral-500 dark:text-neutral-100 text-xs font-bold block mb-4"
                >
                    {`Subtasks (${numCompletedTasks} of ${
                        task.subTasks.length ?? 0
                    })`}
                </span>

                <ul className="flex flex-col gap-2 overflow-y-auto max-h-[20rem]">
                    {subTaskCards}
                </ul>
            </div>
            <div>
                <ModalLabel htmlFor="status-select">Current Status</ModalLabel>
                <select
                    onChange={(e) => handleStatusChange(e)}
                    className="appearance-none w-full bg-neutral-100 dark:bg-neutral-700 border-[1px] 
                                border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 
                                dark:text-neutral-100 px-4 py-3 focus:outline-none focus:border-purple-600 
                                focus:dark:border-purple-600 bg-[url('../public/arrow-down.svg')] 
                                bg-no-repeat bg-[center_right_1rem]"
                    name="status"
                    id="status-select"
                >
                    {selectOptions}
                </select>
            </div>
        </form>
    )
}
