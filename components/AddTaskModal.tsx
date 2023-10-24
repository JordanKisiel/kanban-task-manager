import { useState } from "react"
import ActionButton from "./ActionButton"
import SubTaskInputList from "./SubTaskInputList"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import { addTask } from "@/lib/dataUtils"
import { Column } from "@/types"

type Props = {
    columns: Column[]
    fetchData: Function
    handleBackToBoard: Function
}

type FormData = {
    title: string
    description: string
    subTasks: string[]
    selectedIndex: number
    status: number
}

const TITLE_PLACEHOLDER = "e.g. Take coffee break"
const DESCRIPTION_PLACEHOLDER =
    "e.g. It's always good to take a break. This 15 minute break will charge the batteries a little."

export default function AddTaskModal({
    columns,
    fetchData,
    handleBackToBoard,
}: Props) {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        description: "",
        subTasks: [],
        selectedIndex: 0,
        status: columns[0].id,
    })

    const selectOptions = columns.map((column, index) => {
        return (
            <option
                key={column.id}
                id={`${column.id}`}
                value={index}
            >
                {column.title}
            </option>
        )
    })

    const menuOptions = [
        {
            actionName: "Close",
            action: () => handleBackToBoard(),
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
                subTasks: [...prevFormData.subTasks, ""],
            }
        })
    }

    function handleChangeSubTask(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                subTasks: prevFormData.subTasks.map((subTask, index) => {
                    if (`${index}` === event.target.id) {
                        return event.target.value
                    } else {
                        return subTask
                    }
                }),
            }
        })
    }

    function handleRemoveSubTask(subTaskIndex: number) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                subTasks: prevFormData.subTasks.filter((subTask, index) => {
                    return index !== subTaskIndex
                }),
            }
        })
    }

    function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                selectedIndex: event.target.selectedIndex,
                status: Number(
                    event.target.options[event.target.selectedIndex].id
                ),
            }
        })
    }

    //hard-coding userID for now
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        await addTask(formData)

        await fetchData("be0fc8c3-496f-4ed8-9f27-32dcc66bba24")

        handleBackToBoard()
    }

    return (
        <>
            <div className="flex flex-row justify-between">
                <ModalHeader>Add New Task</ModalHeader>
                <MenuButton actions={menuOptions} />
            </div>
            <form
                onSubmit={(e) => {
                    handleSubmit(e)
                }}
                className="flex flex-col gap-6"
            >
                <div>
                    <label
                        htmlFor="title-input"
                        className="dark:text-neutral-100 text-xs block mb-2"
                    >
                        Title
                    </label>
                    <input
                        onChange={(e) => handleTitleChange(e)}
                        type="text"
                        id="title-input"
                        className="
                            w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 
                            rounded text-sm dark:text-neutral-100 px-4 py-3 outline-2 
                            dark:outline-purple-300 placeholder-dark:text-neutral-500 
                            placeholder-dark:opacity-50"
                        placeholder={TITLE_PLACEHOLDER}
                        value={formData.title}
                    />
                </div>
                <div>
                    <label
                        htmlFor="description-input"
                        className="dark:text-neutral-100 text-xs block mb-2"
                    >
                        Description
                    </label>
                    <textarea
                        onChange={(e) => handleDescriptionChange(e)}
                        id="description-input"
                        className="
                            w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 
                            rounded text-sm dark:text-neutral-100 px-4 py-3 outline-2 
                            dark:outline-purple-300 placeholder-dark:text-neutral-500 
                            placeholder-dark:opacity-50"
                        rows={4}
                        placeholder={DESCRIPTION_PLACEHOLDER}
                        value={formData.description}
                    ></textarea>
                </div>
                <SubTaskInputList
                    subTasks={formData.subTasks}
                    handleAddInput={handleAddSubTask}
                    handleChangeInput={handleChangeSubTask}
                    handleRemoveInput={handleRemoveSubTask}
                />
                <div>
                    <label
                        htmlFor="status-select"
                        className="dark:text-neutral-100 text-xs block mb-2"
                    >
                        Status
                    </label>
                    <select
                        onChange={(e) => handleStatusChange(e)}
                        className="
                            appearance-none w-full dark:bg-neutral-700 border-[1px] 
                            dark:border-neutral-600 rounded text-sm dark:text-neutral-100 
                            px-4 py-3 outline-1 bg-[url('../public/arrow-down.svg')] 
                            bg-no-repeat bg-[center_right_1rem]"
                        name="status"
                        id="status-select"
                        value={formData.selectedIndex}
                    >
                        {selectOptions}
                    </select>
                </div>
                <ActionButton
                    isWidthFull={true}
                    bgColor="dark:bg-purple-600"
                    textColor="dark:text-neutral-100"
                    textSize="text-sm"
                    isSubmit={true}
                >
                    Create Task
                </ActionButton>
            </form>
        </>
    )
}
