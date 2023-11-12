import ActionButton from "./ActionButton"
import { deleteBoard, deleteTask } from "@/lib/dataUtils"
import { Board, Task } from "@/types"
import { useBoards } from "@/lib/dataUtils"

type BoardProps = {
    isBoard: true
    selectedBoardIndex: number
    setIsModalOpen: Function
}

type TaskProps = {
    isBoard: false
    columnIndex: number
    taskIndex: number
    selectedBoardIndex: number
    setIsModalOpen: Function
}

type Props = BoardProps | TaskProps

//TODO: fix this component so it can actually handle a null object

export default function DeleteModal(props: Props) {
    const { boards, isLoading, isError, mutate } = useBoards(
        "be0fc8c3-496f-4ed8-9f27-32dcc66bba24"
    )

    let itemToDelete: Board | Task | null = null

    if (props.isBoard) {
        itemToDelete = boards[props.selectedBoardIndex]
    } else {
        itemToDelete =
            boards[props.selectedBoardIndex].columns[props.columnIndex].tasks[
                props.taskIndex
            ]
    }

    let userMessage = `Are you sure you want to delete the '${
        itemToDelete ? itemToDelete.title : "No board selected"
    }' board? This action will remove all columns and tasks and cannot be reversed.`

    if (!props.isBoard) {
        userMessage = `Are you sure you want to delete the '${
            itemToDelete ? itemToDelete.title : "No task selected"
        }' task and its subtasks? This action cannot be reversed.`
    }

    //hard-coding userId for now
    async function handleDelete(isBoardItem: boolean) {
        let deleteRes

        if (isBoardItem && itemToDelete) {
            deleteRes = await deleteBoard(itemToDelete.id)
        }

        if (!isBoardItem && itemToDelete) {
            deleteRes = await deleteTask(itemToDelete.id)
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
                        handleDelete(props.isBoard)
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
