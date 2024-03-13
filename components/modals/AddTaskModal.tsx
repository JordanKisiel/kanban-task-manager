import { useState, useReducer } from "react"
import { useRouter } from "next/navigation"
import ActionButton from "@/components/ui-elements/ActionButton"
import MenuButton from "@/components/ui-elements/MenuButton"
import ModalHeader from "@/components/modals/ModalHeader"
import { addTask } from "@/lib/dataUtils"
import ModalLabel from "@/components/modals/ModalLabel"
import DynamicInputList from "@/components/ui-elements/DynamicInputList"
import { addTaskReducer } from "@/reducers/formReducers"
import { Column } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import ErrorMessage from "../ui-elements/ErrorMessage"

type Props = {
    selectedBoardIndex: number
    columns: Column[]
    setIsModalOpen: Function
}

const TITLE_PLACEHOLDER = "e.g. Take coffee break"
const DESCRIPTION_PLACEHOLDER =
    "e.g. It's always good to take a break. This 15 minute break will charge the batteries a little."

export default function AddTaskModal({
    selectedBoardIndex,
    columns,
    setIsModalOpen,
}: Props) {
    const router = useRouter()

    const queryClient = useQueryClient()

    const [formData, dispatch] = useReducer(addTaskReducer, {
        title: "",
        description: "",
        subTasks: [],
        selectedIndex: 0,
        status: columns[0].id,
    })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [displayError, setDisplayError] = useState<boolean>(true)

    const addTaskMutation = useMutation({
        mutationFn: addTask,
        onMutate: () => {
            setIsSubmitted(true)
            setDisplayError(true)
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boardsData"] })
            queryClient.invalidateQueries({ queryKey: ["tasksData"] })
            setIsModalOpen(false)
        },
        onError: () => {
            setIsSubmitted(false)
            console.log(
                "There was an error during submission. Please try again."
            )
        },
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
            title: event.target.value,
        })
    }

    function handleDescriptionChange(
        event: React.ChangeEvent<HTMLTextAreaElement>
    ) {
        dispatch({
            type: "change_description",
            description: event.target.value,
        })
    }

    function handleAddSubTask() {
        dispatch({
            type: "add_subTask",
            text: "",
        })
    }

    function handleChangeSubTask(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch({
            type: "change_subTask",
            id: event.target.id,
            text: event.target.value,
        })
    }

    function handleRemoveSubTask(subTaskIndex: number) {
        dispatch({
            type: "remove_subTask",
            index: subTaskIndex,
        })
    }

    function handleStatusChange(event: React.ChangeEvent<HTMLSelectElement>) {
        dispatch({
            type: "change_status",
            index: event.target.selectedIndex,
            status: Number(event.target.options[event.target.selectedIndex].id),
        })
    }

    function handleCloseError() {
        setDisplayError(false)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        addTaskMutation.mutate(formData)
    }

    return (
        <div className={`${isSubmitted ? "opacity-50" : "opacity-100"}`}>
            <form
                onSubmit={(e) => {
                    handleSubmit(e)
                }}
                className="flex flex-col gap-6"
            >
                {addTaskMutation.isError && displayError && (
                    <ErrorMessage
                        message="There was a problem adding the task. Please try again."
                        close={handleCloseError}
                    />
                )}
                <div className="flex flex-row justify-between">
                    <ModalHeader>Add New Task</ModalHeader>
                    <MenuButton actions={menuOptions} />
                </div>
                <div>
                    <ModalLabel htmlFor="title-input">Title</ModalLabel>
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
                    <ModalLabel htmlFor="description-input">
                        Description
                    </ModalLabel>
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
                <DynamicInputList
                    values={formData.subTasks}
                    title="Subtasks"
                    addNewText="Add New Subtask"
                    initialPlaceholder="e.g. Make coffee"
                    handleAddInput={handleAddSubTask}
                    handleChangeInput={handleChangeSubTask}
                    handleRemoveInput={handleRemoveSubTask}
                />
                <div>
                    <ModalLabel htmlFor="status-select">Status</ModalLabel>
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
                    isDisabled={isSubmitted}
                    isLoading={isSubmitted}
                >
                    Create Task
                </ActionButton>
            </form>
        </div>
    )
}
