import ActionButton from "./ActionButton"
import SubTaskInputList from "./SubTaskInputList"
import { Task } from "../types"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import ModalLabel from "./ModalLabel"
import { useBoards } from "@/lib/dataUtils"

type Props = {
    selectedBoardIndex: number
    columnIndex: number
    taskIndex: number
    handleSwitchModalMode: Function
    handleBackToBoard: Function
}

const TITLE_PLACEHOLDER = "e.g. Take coffee break"
const DESCRIPTION_PLACEHOLDER =
    "e.g. It's always good to take a break. This 15 minute break will charge the batteries a little."

//TODO: add the ability to pass subtasks array into SubtaskInputList and have it render those out automatically (if they exist)

export default function EditTaskModal({
    selectedBoardIndex,
    columnIndex,
    taskIndex,
    handleSwitchModalMode,
    handleBackToBoard,
}: Props) {
    const { boards, isLoading, isError, mutate } = useBoards(
        "be0fc8c3-496f-4ed8-9f27-32dcc66bba24"
    )

    const task =
        boards[selectedBoardIndex].columns[columnIndex].tasks[taskIndex]

    const currentColumn = boards[selectedBoardIndex].columns[columnIndex].title

    const otherColumns = boards[selectedBoardIndex].columns
        .filter((column, index) => {
            return index !== columnIndex
        })
        .map((column) => column.title)

    const columnNames = [currentColumn, ...otherColumns]

    const selectOptions = columnNames.map((columnName) => {
        return (
            <option
                key={columnName}
                value={columnName ? columnName : ""}
            >
                {columnName}
            </option>
        )
    })

    const menuOptions = [
        {
            actionName: "View",
            action: () => handleSwitchModalMode("viewTask"),
        },
        {
            actionName: "Delete",
            action: () => handleSwitchModalMode("deleteTask"),
        },
        {
            actionName: "Close",
            action: () => handleBackToBoard(),
        },
    ]

    return (
        <>
            <div className="flex flex-row justify-between">
                <ModalHeader>Edit Task</ModalHeader>
                <MenuButton actions={menuOptions} />
            </div>
            <form className="flex flex-col gap-6">
                <div>
                    <ModalLabel htmlFor="title-input">Title</ModalLabel>
                    <input
                        type="text"
                        id="title-input"
                        className="
                            w-full bg-neutral-100 dark:bg-neutral-700 border-[1px] border-neutral-300 
                            dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100 
                            px-4 py-3 outline-2 outline-purple-300 placeholder:text-neutral-500 
                            dark:placeholder:opacity-50"
                        placeholder={TITLE_PLACEHOLDER}
                        value={task ? task.title : "No task selected"}
                    />
                </div>
                <div>
                    <ModalLabel htmlFor="description-input">
                        Description
                    </ModalLabel>
                    <textarea
                        id="description-input"
                        className="
                            w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 rounded 
                            text-sm dark:text-neutral-100 px-4 py-3 outline-2 dark:outline-purple-300 
                            placeholder-dark:text-neutral-500 placeholder-dark:opacity-50"
                        rows={4}
                        placeholder={DESCRIPTION_PLACEHOLDER}
                    >
                        {task ? task.description : "No task selected"}
                    </textarea>
                </div>
                <SubTaskInputList
                    subTasks={task.subTasks.map(
                        (subTask) => subTask.description
                    )}
                />
                <div>
                    <ModalLabel htmlFor="status-select">Status</ModalLabel>
                    <select
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
                    handler={() => {
                        /*does nothing*/
                    }}
                >
                    Save Task Changes
                </ActionButton>
            </form>
        </>
    )
}
