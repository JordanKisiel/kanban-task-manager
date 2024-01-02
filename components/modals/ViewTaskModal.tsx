"use client"

import SubtaskCard from "@/components/app-elements/SubtaskCard"
import MenuButton from "@/components/ui-elements/MenuButton"
import ModalHeader from "@/components/modals/ModalHeader"
import ModalLabel from "@/components/modals/ModalLabel"
import { useState, useEffect } from "react"
import { Column } from "@/types"
import { Task } from "@/types"
import { useRouter } from "next/navigation"

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

    //the create & delete arrays will never be altered here
    //but are provided so the same editTask function can be re-used
    const [formData, setFormData] = useState<FormData>({
        title: task.title,
        description: task.description,
        subTasks: {
            create: [],
            update: [...task.subTasks],
            delete: [],
        },
        columnId: task.columnId,
    })

    const numCompletedTasks = formData.subTasks.update.reduce((accum, curr) => {
        const valueToAdd = curr.isComplete ? 1 : 0
        return accum + valueToAdd
    }, 0)

    const subTaskCards = formData.subTasks.update.map((subTask, index) => {
        return (
            <SubtaskCard
                key={subTask.id}
                subtask={subTask}
                handleCheck={() => handleCheck(index)}
            />
        )
    })

    const currentColumn =
        formData.columnId === null
            ? []
            : columns.filter((column) => {
                  return column.id === formData.columnId
              })

    const otherColumns =
        formData.columnId === null
            ? []
            : columns.filter((column) => {
                  return column.id !== formData.columnId
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
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                subTasks: {
                    create: [],
                    update: prevFormData.subTasks.update.map(
                        (subTask, index) => {
                            if (inputIndex === index) {
                                return {
                                    ...subTask,
                                    isComplete: !subTask.isComplete,
                                }
                            } else {
                                return subTask
                            }
                        }
                    ),
                    delete: [],
                },
            }
        })
    }

    function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedOptionIndex = event.target.options.selectedIndex
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                columnId: Number(event.target.options[selectedOptionIndex].id),
            }
        })
    }

    return (
        <form>
            <div className="flex flex-row mb-6 justify-between items-start">
                <ModalHeader>{formData.title}</ModalHeader>

                <MenuButton actions={menuOptions} />
            </div>
            <p className="text-neutral-500 text-sm leading-6 mb-6">
                {formData.description}
            </p>

            <div className="mb-5">
                <span
                    className="
                text-neutral-500 dark:text-neutral-100 text-xs font-bold block mb-4"
                >
                    {`Subtasks (${numCompletedTasks} of ${
                        formData.subTasks.update
                            ? formData.subTasks.update.length
                            : 0
                    })`}
                </span>

                <ul className="flex flex-col gap-2">{subTaskCards}</ul>
            </div>
            <div>
                <ModalLabel htmlFor="status-select">Current Status</ModalLabel>
                <select
                    onChange={(e) => handleStatusChange(e)}
                    className="appearance-none w-full bg-neutral-100 dark:bg-neutral-700 border-[1px] 
                                border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 
                                dark:text-neutral-100 px-4 py-3 outline-2 dark:outline-purple-300 
                                bg-[url('../public/arrow-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                    name="status"
                    id="status-select"
                >
                    {selectOptions}
                </select>
            </div>
        </form>
    )
}
