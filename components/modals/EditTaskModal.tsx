import { useState, useReducer } from "react"
import ActionButton from "@/components/ui-elements/ActionButton"
import MenuButton from "@/components/ui-elements/MenuButton"
import ModalHeader from "@/components/modals/ModalHeader"
import ModalLabel from "@/components/modals/ModalLabel"
import { editTask } from "@/lib/dataUtils"
import DynamicInputList from "@/components/ui-elements/DynamicInputList"
import ErrorMessage from "@/components/ui-elements/ErrorMessage"
import { useRouter } from "next/navigation"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editTaskReducer } from "@/reducers/formReducers"
import { Column, Task } from "@/types"
import { BUTTON_TEXT_EDIT_TASK } from "@/lib/config"
import TitleInput from "../ui-elements/TitleInput"
import DescriptionInput from "../ui-elements/DescriptionInput"

type Props = {
    selectedBoardIndex: number
    task: Task
    columns: Column[]
    setModalMode: Function
    setIsModalOpen: Function
}

const TITLE_PLACEHOLDER = "e.g. Take coffee break"
const DESCRIPTION_PLACEHOLDER =
    "e.g. It's always good to take a break. This 15 minute break will charge the batteries a little."

export default function EditTaskModal({
    selectedBoardIndex,
    task,
    columns,
    setModalMode,
    setIsModalOpen,
}: Props) {
    const router = useRouter()

    const queryClient = useQueryClient()

    const [formData, dispatch] = useReducer(editTaskReducer, {
        title: task.title,
        description: task.description,
        subTasks: {
            create: [],
            update: [...task.subTasks],
            delete: [],
        },
        columnId: task?.columnId || null,
    })

    const editTaskMutation = useMutation({
        mutationFn: editTask,
        onMutate: () => {
            setIsSubmitted(true)
            setDisplayError(true)
        },
        onSuccess: () => {
            setIsModalOpen(false)
            router.push(`?board=${selectedBoardIndex}`)
            queryClient.invalidateQueries({ queryKey: ["boardsData"] })
            queryClient.invalidateQueries({ queryKey: ["tasksData"] })
        },
        onError: () => {
            setIsSubmitted(false)
            console.log("There was an error. Please try again.")
        },
    })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [displayError, setDisplayError] = useState<boolean>(true)

    //subTask descriptions to render
    //always render update subTasks first
    const subTaskDescriptions = [
        ...formData.subTasks.update.map((subTask) => {
            return subTask.description
        }),
        ...formData.subTasks.create,
    ]

    const currentColumn = columns.filter((column) => {
        return column.id === task.columnId
    })

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
            action: () => {
                setIsModalOpen(false)
                router.push(`?board=${selectedBoardIndex}`)
            },
            isDisabled: false,
        },
    ]

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch({
            type: "change_title",
            text: event.target.value,
        })
    }

    function handleDescriptionChange(
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        dispatch({
            type: "change_description",
            text: event.target.value,
        })
    }

    function handleAddSubTask() {
        dispatch({
            type: "add_subTask",
            text: "",
        })
    }

    function handleChangeSubTask(
        event: React.ChangeEvent<HTMLInputElement>,
        inputIndex: number
    ) {
        dispatch({
            type: "change_subTask",
            index: inputIndex,
            text: event.target.value,
        })
    }

    function handleRemoveSubTask(inputIndex: number) {
        dispatch({
            type: "remove_subTask",
            index: inputIndex,
        })
    }

    function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
        const selectedIndex = event.target.options.selectedIndex
        dispatch({
            type: "change_status",
            id: Number(event.target.options[selectedIndex].id),
        })
    }

    function handleCloseError() {
        setDisplayError(false)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        editTaskMutation.mutate({
            taskId: task.id,
            title: formData.title,
            description: formData.description,
            subTasks: {
                create: [...formData.subTasks.create],
                update: [...formData.subTasks.update],
                delete: [...formData.subTasks.delete],
            },
            columnId: formData.columnId,
        })
    }

    return (
        <div className={`${isSubmitted ? "opacity-50" : "opacity-100"}`}>
            <form
                onSubmit={(e) => handleSubmit(e)}
                className="flex flex-col gap-6"
            >
                {editTaskMutation.isError && displayError && (
                    <ErrorMessage
                        message="There was a problem adding the board. Please try again."
                        close={handleCloseError}
                    />
                )}
                <div className="flex flex-row justify-between">
                    <ModalHeader>Edit Task</ModalHeader>
                    <MenuButton actions={menuOptions} />
                </div>
                <div>
                    <TitleInput
                        handleTitleChange={handleTitleChange}
                        titlePlaceholder={TITLE_PLACEHOLDER}
                        titleValue={formData.title}
                        labelText="Title"
                    />
                </div>
                <div>
                    <DescriptionInput
                        handleDescriptionChange={handleDescriptionChange}
                        descriptionPlaceholder={DESCRIPTION_PLACEHOLDER}
                        descriptionValue={formData.description}
                        descriptionContent={task ? task.description : ""}
                        labelText="Description"
                    />
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
                            dark:text-neutral-100 px-4 py-3 focus:outline-none focus:border-purple-600 
                            focus:dark:border-purple-600 bg-[url('../public/arrow-down.svg')] 
                            bg-no-repeat bg-[center_right_1rem]"
                        name="status"
                        id="status-select"
                    >
                        {selectOptions}
                    </select>
                </div>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-purple-600"
                    bgHoverColor="hover:bg-purple-300"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    isSubmit={true}
                    isDisabled={isSubmitted}
                    isLoading={isSubmitted}
                >
                    {BUTTON_TEXT_EDIT_TASK}
                </ActionButton>
            </form>
        </div>
    )
}
