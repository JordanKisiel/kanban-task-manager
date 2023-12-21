import { useSWRConfig } from "swr"
import SubtaskCard from "./SubtaskCard"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import ModalLabel from "./ModalLabel"
import { editTask, useBoards } from "@/lib/dataUtils"
import { testUserId } from "@/testing/testingConsts"
import { useState, useEffect } from "react"
import { Task } from "@/types"
import ItemSkeleton from "./ItemSkeleton"

type Props = {
    selectedBoardIndex: number
    taskId: number | null
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
    taskId,
    setModalMode,
    setIsModalOpen,
}: Props) {
    const { boards, isLoading, isError } = useBoards(testUserId)
    const { mutate } = useSWRConfig()

    const tasks = isLoading
        ? []
        : boards[selectedBoardIndex].columns
              .map((column) => {
                  return column.tasks.map((task) => {
                      return task
                  })
              })
              .flat()

    const task: Task | null =
        taskId !== null
            ? tasks.filter((task) => {
                  return task.id === taskId
              })[0]
            : null

    //the create & delete arrays will never be altered here
    //but are provided so the same editTask function can be re-used
    const [formData, setFormData] = useState<FormData>({
        title: task?.title || "",
        description: task?.description || "",
        subTasks: {
            create: [],
            update: task?.subTasks || [],
            delete: [],
        },
        columnId: task?.columnId || null,
    })

    const numCompletedTasks = formData.subTasks.update.reduce((accum, curr) => {
        const valueToAdd = curr.isComplete ? 1 : 0
        return accum + valueToAdd
    }, 0)

    const subTaskCards = isLoading
        ? []
        : formData.subTasks.update.map((subTask, index) => {
              return (
                  <SubtaskCard
                      key={subTask.id}
                      subtask={subTask}
                      handleCheck={() => handleCheck(index)}
                  />
              )
          })

    const currentColumn =
        isLoading || formData.columnId === null
            ? []
            : boards[selectedBoardIndex].columns.filter((column) => {
                  return column.id === formData.columnId
              })

    const otherColumns =
        isLoading || formData.columnId === null
            ? []
            : boards[selectedBoardIndex].columns.filter((column) => {
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
            },
            isDisabled: false,
        },
    ]

    //sets formData when loading is done
    //this is required in cases where the taskId is already
    //present in the search params so this component opens automatically
    //possibly before the loading of data is complete
    useEffect(() => {
        if (!isLoading && task !== null) {
            setFormData((prevFormData) => {
                return {
                    ...prevFormData,
                    title: task.title,
                    description: task.description,
                    subTasks: {
                        ...prevFormData.subTasks,
                        update: task.subTasks,
                    },
                    columnId: task.columnId,
                }
            })
        }
    }, [isLoading, task])

    //sends data to server whenever there's a form change
    useEffect(() => {
        async function handleFormChange() {
            let res

            if (task !== null) {
                res = await editTask(task.id, formData)
            }

            if (res && res.ok) {
                console.log("mutate called")
                mutate(boards, { revalidate: true })
            }
        }

        if (!isLoading && formData.columnId !== null) {
            console.log("sent data to server")
            handleFormChange()
        }
    }, [formData, isLoading])

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
                {!isLoading ? (
                    <ModalHeader>{formData.title}</ModalHeader>
                ) : (
                    <ItemSkeleton
                        bgColor="dark:bg-neutral-800"
                        height="large"
                        width="medium"
                        margins=""
                        opacity="opacity-100"
                    />
                )}

                <MenuButton
                    actions={menuOptions}
                    isDisabled={isLoading}
                />
            </div>
            {!isLoading ? (
                <p className="text-neutral-500 text-sm leading-6 mb-6">
                    {formData.description}
                </p>
            ) : (
                <ItemSkeleton
                    bgColor="dark:bg-neutral-800"
                    height="small"
                    width="medium"
                    margins="mb-6"
                    opacity="opacity-100"
                />
            )}

            <div className="mb-5">
                {!isLoading ? (
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
                ) : (
                    <>
                        <ItemSkeleton
                            bgColor="dark:bg-neutral-800"
                            height="small"
                            width="small"
                            margins="mb-4"
                            opacity="opacity-100"
                        />
                        <ItemSkeleton
                            bgColor="dark:bg-neutral-800"
                            height="small"
                            width="small"
                            margins="mb-4"
                            opacity="opacity-100"
                        />
                    </>
                )}

                <ul className="flex flex-col gap-2">{subTaskCards}</ul>
            </div>
            <div>
                {!isLoading ? (
                    <>
                        <ModalLabel htmlFor="status-select">
                            Current Status
                        </ModalLabel>
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
                    </>
                ) : (
                    <>
                        <ItemSkeleton
                            bgColor="dark:bg-neutral-800"
                            height="small"
                            width="small"
                            margins="mb-3"
                            opacity="opacity-100"
                        />
                        <ItemSkeleton
                            bgColor="dark:bg-neutral-800"
                            height="large"
                            width="medium"
                            margins=""
                            opacity="opacity-100"
                        />
                    </>
                )}
            </div>
        </form>
    )
}
