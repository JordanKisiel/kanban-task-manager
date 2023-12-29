import ActionButton from "./ActionButton"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import ModalLabel from "./ModalLabel"
import { editTask } from "@/lib/dataUtils"
import DynamicInputList from "./DynamicInputList"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { taskByIdOptions } from "@/lib/queries"
import { Column } from "@/types"

type Props = {
    selectedBoardIndex: number
    taskId: number
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
        }[]
        delete: {
            id: number
        }[]
    }
    columnId: number | null
}

const TITLE_PLACEHOLDER = "e.g. Take coffee break"
const DESCRIPTION_PLACEHOLDER =
    "e.g. It's always good to take a break. This 15 minute break will charge the batteries a little."

export default function EditTaskModal({
    selectedBoardIndex,
    taskId,
    columns,
    setModalMode,
    setIsModalOpen,
}: Props) {
    const {
        data: task,
        isPending,
        isError,
        isSuccess,
    } = useQuery(taskByIdOptions(taskId))

    const router = useRouter()

    const [formData, setFormData] = useState<FormData>({
        title: isSuccess ? task.title : "",
        description: isSuccess ? task.description : "",
        subTasks: {
            create: [],
            update: isSuccess ? [...task.subTasks] : [],
            delete: [],
        },
        columnId: task?.columnId || null,
    })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    //subTask descriptions to render
    //always render update subTasks first
    const subTaskDescriptions = [
        ...formData.subTasks.update.map((subTask) => {
            return subTask.description
        }),
        ...formData.subTasks.create,
    ]

    const currentColumn = isSuccess
        ? columns.filter((column) => {
              return column.id === task.columnId
          })
        : []

    const otherColumns = columns.filter((column) => {
        return task?.columnId !== column.id
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
            actionName: "View",
            action: () => setModalMode("viewTask"),
            isDisabled: false,
        },
        {
            actionName: "Delete",
            action: () => setModalMode("deleteTask"),
            isDisabled: false,
        },
        {
            actionName: "Close",
            action: () => setIsModalOpen(),
            isDisabled: false,
        },
    ]

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                title: event.target.value,
            }
        })
    }

    function handleDescriptionChange(
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                description: event.target.value,
            }
        })
    }

    function handleAddSubTask() {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                subTasks: {
                    ...prevFormData.subTasks,
                    create: [...prevFormData.subTasks.create, ""],
                },
            }
        })
    }

    // mapping the CREATE array:
    //   -we look for (inputIndex - UPDATE.length) === index
    //   -because the update array is always rendered before the create array
    // mapping the UPDATE array:
    //   -we look for inputIndex === index
    // and there is never mapping for DELETE
    //   -because it's never rendered
    function handleChangeSubTask(
        event: React.ChangeEvent<HTMLInputElement>,
        inputIndex: number
    ) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                subTasks: {
                    create: prevFormData.subTasks.create.map(
                        (subTask, index) => {
                            if (
                                inputIndex -
                                    prevFormData.subTasks.update.length ===
                                index
                            ) {
                                return event.target.value
                            } else {
                                return subTask
                            }
                        }
                    ),
                    update: prevFormData.subTasks.update.map(
                        (subTask, index) => {
                            if (inputIndex === index) {
                                return {
                                    id: subTask.id,
                                    description: event.target.value,
                                }
                            } else {
                                return subTask
                            }
                        }
                    ),
                    delete: [...prevFormData.subTasks.delete],
                },
            }
        })
    }

    // filtering the CREATE array:
    //   -we look for (inputIndex - UPDATE.length) !== index
    //   -because the update array is always rendered before the create array
    // filtering the UPDATE array:
    //   -we look for inputIndex !== index
    // for the DELETE array:
    //   -we look for inputIndex === index in the UPDATE array
    //   -because that's the item that already exists in the DB that will
    //    have to be removed
    //   -DELETE is also processed first so we can find the item to remove
    //    before filtering it from UPDATE
    function handleRemoveSubTask(inputIndex: number) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                subTasks: {
                    create: prevFormData.subTasks.create.filter(
                        (subTask, index) => {
                            return (
                                inputIndex -
                                    prevFormData.subTasks.update.length !==
                                index
                            )
                        }
                    ),
                    delete: [
                        ...prevFormData.subTasks.delete,
                        ...prevFormData.subTasks.update.filter(
                            (subTask, index) => {
                                return inputIndex === index
                            }
                        ),
                    ],
                    update: prevFormData.subTasks.update.filter(
                        (subTask, index) => {
                            return inputIndex !== index
                        }
                    ),
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

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setIsSubmitted(true)

        let res

        if (isSuccess) {
            res = await editTask(task.id, formData)
        }

        // if (res && res.ok) {
        //     mutate(boards, { revalidate: true })
        // }

        setIsModalOpen(false)
        router.push(`/?board=${selectedBoardIndex}`)
    }

    return (
        <div className={`${isSubmitted ? "opacity-50" : "opacity-100"}`}>
            <div className="flex flex-row justify-between">
                <ModalHeader>Edit Task</ModalHeader>
                <MenuButton actions={menuOptions} />
            </div>
            <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col gap-6"
            >
                <div>
                    <ModalLabel htmlFor="title-input">Title</ModalLabel>
                    <input
                        onChange={(e) => handleTitleChange(e)}
                        type="text"
                        id="title-input"
                        className="
                            w-full bg-neutral-100 dark:bg-neutral-700 border-[1px] border-neutral-300 
                            dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100 
                            px-4 py-3 outline-2 outline-purple-300 placeholder:text-neutral-500 
                            dark:placeholder:opacity-50"
                        placeholder={TITLE_PLACEHOLDER}
                        value={formData.title}
                    />
                </div>
                <div>
                    <ModalLabel htmlFor="description-input">
                        Description
                    </ModalLabel>
                    <textarea
                        onChange={(e) => handleDescriptionChange(e)}
                        id="description-input"
                        className="
                            w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 rounded 
                            text-sm dark:text-neutral-100 px-4 py-3 outline-2 dark:outline-purple-300 
                            placeholder-dark:text-neutral-500 placeholder-dark:opacity-50"
                        rows={4}
                        placeholder={DESCRIPTION_PLACEHOLDER}
                        value={formData.description}
                    >
                        {task ? task.description : "No task selected"}
                    </textarea>
                </div>
                <DynamicInputList
                    title="Subtasks"
                    addNewText="Add New Subtask"
                    initialPlaceholder="e.g. make plan"
                    values={subTaskDescriptions}
                    handleAddInput={handleAddSubTask}
                    handleChangeInput={handleChangeSubTask}
                    handleRemoveInput={handleRemoveSubTask}
                />
                <div>
                    <ModalLabel htmlFor="status-select">Status</ModalLabel>
                    <select
                        onChange={(e) => handleStatusChange(e)}
                        className="
                            appearance-none w-full bg-neutral-100 dark:bg-neutral-700 border-[1px] 
                            border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 
                            dark:text-neutral-100 px-4 py-3 outline-2 outline-purple-300 
                            bg-[url('../public/arrow-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                        name="status"
                        id="status-select"
                    >
                        {selectOptions}
                    </select>
                </div>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    isSubmit={true}
                    isDisabled={isSubmitted}
                    isLoading={isSubmitted}
                >
                    Save Task Changes
                </ActionButton>
            </form>
        </div>
    )
}
