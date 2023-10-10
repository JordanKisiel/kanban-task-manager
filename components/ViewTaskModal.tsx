import { Task } from "../types"
import SubtaskCard from "./SubtaskCard"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import ModalLabel from "./ModalLabel"

type Props = {
    task: Task | null
    otherColumns: string[]
    currentColumn: string | null
    handleSwitchModalMode: Function
    handleBackToBoard: Function
}

export default function ViewTaskModal({
    task,
    otherColumns,
    currentColumn,
    handleSwitchModalMode,
    handleBackToBoard,
}: Props) {
    const numCompletedTasks = task?.subtasks.reduce((accum, curr) => {
        const valueToAdd = curr.isComplete ? 1 : 0
        return accum + valueToAdd
    }, 0)

    const subtaskCards = task?.subtasks.map((subtask) => {
        return (
            <SubtaskCard
                key={subtask.description}
                subtask={subtask}
            />
        )
    })

    const otherColumnOptions = otherColumns.map((column) => {
        return (
            <option
                key={column}
                value={column}
            >
                {column}
            </option>
        )
    })

    const currentColumnOption =
        currentColumn !== null ? (
            <option
                key={currentColumn}
                value={currentColumn}
            >
                {currentColumn}
            </option>
        ) : (
            <option
                key="Null Column"
                value="No columns"
            >
                {"No columns"}
            </option>
        )

    const columnOptions = [currentColumnOption, ...otherColumnOptions]

    const menuOptions = [
        {
            actionName: "Edit",
            action: () => handleSwitchModalMode("editTask"),
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
            <div className="flex flex-row mb-6 justify-between items-start">
                <ModalHeader>
                    {task ? task.title : "No task selected"}
                </ModalHeader>
                <MenuButton actions={menuOptions} />
            </div>
            <p className="text-neutral-500 text-sm leading-6 mb-6">
                {task ? task.description : "No task selected"}
            </p>
            <div className="mb-5">
                <span className="text-neutral-500 dark:text-neutral-100 text-xs font-bold block mb-4">{`Subtasks (${numCompletedTasks} of ${
                    task ? task.subtasks.length : 0
                })`}</span>
                <ul className="flex flex-col gap-2">{subtaskCards}</ul>
            </div>
            <div>
                <ModalLabel htmlFor="status-select">Current Status</ModalLabel>
                <select
                    className="appearance-none w-full bg-neutral-100 dark:bg-neutral-700 border-[1px] border-neutral-300 dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100 px-4 py-3 outline-2 dark:outline-purple-300 bg-[url('../public/arrow-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                    name="status"
                    id="status-select"
                >
                    {columnOptions}
                </select>
            </div>
        </>
    )
}
