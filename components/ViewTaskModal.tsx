import SubtaskCard from "./SubtaskCard"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import ModalLabel from "./ModalLabel"
import { useBoards } from "@/lib/dataUtils"

type Props = {
    selectedBoardIndex: number
    columnIndex: number
    taskIndex: number
    setModalMode: Function
    setIsModalOpen: Function
}

export default function ViewTaskModal({
    selectedBoardIndex,
    columnIndex,
    taskIndex,
    setModalMode,
    setIsModalOpen,
}: Props) {
    const { boards, isLoading, isError, mutate } = useBoards(
        "be0fc8c3-496f-4ed8-9f27-32dcc66bba24"
    )

    const task =
        boards[selectedBoardIndex].columns[columnIndex].tasks[taskIndex]

    const numCompletedTasks = task.subTasks.reduce((accum, curr) => {
        const valueToAdd = curr.isComplete ? 1 : 0
        return accum + valueToAdd
    }, 0)

    const subtaskCards = task.subTasks.map((subTask) => {
        return (
            <SubtaskCard
                key={subTask.description}
                subtask={subTask}
            />
        )
    })

    const currentColumn = boards[selectedBoardIndex].columns[columnIndex].title
    const otherColumns = boards[selectedBoardIndex].columns.filter(
        (column, index) => {
            return index !== columnIndex
        }
    )

    const currentColumnOption = (
        <option value={currentColumn}>{currentColumn}</option>
    )

    const otherColumnOptions = otherColumns.map((column, index) => {
        return (
            <option
                key={index}
                value={column.title}
            >
                {column.title}
            </option>
        )
    })

    const columnOptions = [currentColumnOption, ...otherColumnOptions]

    const menuOptions = [
        {
            actionName: "Edit",
            action: () => setModalMode("editTask"),
        },
        {
            actionName: "Delete",
            action: () => setModalMode("deleteTask"),
        },
        {
            actionName: "Close",
            action: () => setIsModalOpen(false),
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
                <span
                    className="
                    text-neutral-500 dark:text-neutral-100 text-xs font-bold block mb-4"
                >
                    {`Subtasks (${numCompletedTasks} of ${
                        task ? task.subTasks.length : 0
                    })`}
                </span>
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
