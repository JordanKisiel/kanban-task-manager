import ActionButton from "./ActionButton"
import { deleteBoard } from "@/lib/dataUtils"
import { Board, Task } from "@/types"

type Props = {
    isBoard: boolean
    numBoards: number
    itemToDelete: Board | Task | null
    changeSelectedBoard: Function
    fetchData: Function
    handleBackToBoard: Function
}

//TODO: fix this component so it can actually handle a null object

export default function DeleteModal({
    isBoard,
    numBoards,
    itemToDelete,
    changeSelectedBoard,
    fetchData,
    handleBackToBoard,
}: Props) {
    let userMessage = `Are you sure you want to delete the '${
        itemToDelete ? itemToDelete.title : "No board selected"
    }' board? This action will remove all columns and tasks and cannot be reversed.`

    if (!isBoard) {
        userMessage = `Are you sure you want to delete the '${
            itemToDelete ? itemToDelete.title : "No task selected"
        }' task and its subtasks? This action cannot be reversed.`
    }

    //hard-coding userId for now
    async function handleDelete(isBoardItem: boolean) {
        let deleteRes
        let fetchRes

        if (isBoardItem && itemToDelete) {
            deleteRes = await deleteBoard(itemToDelete.id)
        }

        if (deleteRes && deleteRes.ok) {
            fetchRes = await fetchData("be0fc8c3-496f-4ed8-9f27-32dcc66bba24")
        }

        if (fetchRes && fetchRes.ok) {
            changeSelectedBoard(numBoards - 1)
        }

        handleBackToBoard()
    }

    return (
        <div className="flex flex-col gap-6 bg-neutral-100 dark:bg-neutral-700">
            <h4 className="font-bold text-red-300 text-lg">
                {`Delete this ${isBoard ? "board" : "task"}?`}
            </h4>
            <p className="text-sm text-neutral-500 leading-6">{userMessage}</p>
            <div className="flex flex-col gap-4 md:flex-row">
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-red-300"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    handler={() => {
                        handleDelete(isBoard)
                    }}
                >
                    Delete
                </ActionButton>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-neutral-300 dark:bg-neutral-100"
                    textColor="text-purple-600"
                    textSize="text-sm"
                    handler={() => handleBackToBoard()}
                >
                    Cancel
                </ActionButton>
            </div>
        </div>
    )
}
