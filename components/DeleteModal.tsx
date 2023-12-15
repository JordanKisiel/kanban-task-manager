import ActionButton from "./ActionButton"
import { deleteBoard, deleteTask } from "@/lib/dataUtils"
import { Board, Task } from "@/types"
import { useBoards } from "@/lib/dataUtils"
import { testUserId } from "@/testing/testingConsts"

type BoardProps = {
    isBoard: true
    selectedBoardIndex: number
    setIsModalOpen: Function
    changeSelectedBoardIndex: Function
}

type TaskProps = {
    isBoard: false
    taskId: number | null
    selectedBoardIndex: number
    setIsModalOpen: Function
}

type Props = BoardProps | TaskProps

export default function DeleteModal(props: Props) {
    const { boards, isLoading, isError, mutate } = useBoards(testUserId)

    let itemToDelete: Board | Task | null = null

    if (props.isBoard) {
        itemToDelete = boards[props.selectedBoardIndex]
    } else {
        const tasks = boards[props.selectedBoardIndex].columns
            .map((column) => {
                return column.tasks.map((task) => {
                    return task
                })
            })
            .flat()

        itemToDelete = tasks.filter((task) => {
            return task.id === props.taskId
        })[0]
    }

    let userMessage = `Are you sure you want to delete the '${
        itemToDelete ? itemToDelete.title : "No board selected"
    }' board? This action will remove all columns and tasks and cannot be reversed.`

    if (!props.isBoard) {
        userMessage = `Are you sure you want to delete the '${
            itemToDelete ? itemToDelete.title : "No task selected"
        }' task and its subtasks? This action cannot be reversed.`
    }

    async function handleDelete() {
        let deleteRes: Response | undefined

        if (props.isBoard && itemToDelete) {
            deleteRes = await deleteBoard(itemToDelete.id)
        }

        if (!props.isBoard && itemToDelete) {
            deleteRes = await deleteTask(itemToDelete.id)
        }

        //revalidating all data regardless of whether
        //we're deleting a task or board
        if (deleteRes && deleteRes.ok) {
            mutate(boards, { revalidate: true })
        }

        if (props.isBoard) {
            props.changeSelectedBoardIndex(0)
        }

        props.setIsModalOpen()
    }

    return (
        <div className="flex flex-col gap-6 bg-neutral-100 dark:bg-neutral-700">
            <h4 className="font-bold text-red-300 text-lg">
                {`Delete this ${props.isBoard ? "board" : "task"}?`}
            </h4>
            <p className="text-sm text-neutral-500 leading-6">{userMessage}</p>
            <div className="flex flex-col gap-4 md:flex-row">
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-red-300"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    handler={() => {
                        handleDelete()
                    }}
                >
                    Delete
                </ActionButton>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-neutral-300 dark:bg-neutral-100"
                    textColor="text-purple-600"
                    textSize="text-sm"
                    handler={() => props.setIsModalOpen()}
                >
                    Cancel
                </ActionButton>
            </div>
        </div>
    )
}
