import ActionButton from "./ActionButton"
import { Board, Task } from "@/types"

type Props = {
    isBoard: boolean
    itemToDelete: Board | Task | null
}

//TODO: fix this component so it can actually handle a null object

export default function DeleteModal({ isBoard, itemToDelete }: Props) {
    let userMessage = `Are you sure you want to delete the '${
        itemToDelete ? itemToDelete.title : "No board selected"
    }' board? This action will remove all columns and tasks and cannot be reversed.`

    if (!isBoard) {
        userMessage = `Are you sure you want to delete the '${
            itemToDelete ? itemToDelete.title : "No task selected"
        }' task and its subtasks? This action cannot be reversed.`
    }

    return (
        <div className="flex flex-col gap-6 bg-neutral-700">
            <h4 className="font-bold text-red-300 text-lg">
                {`Delete this ${isBoard ? "board" : "task"}?`}
            </h4>
            <p className="text-sm text-neutral-500 leading-6">{userMessage}</p>
            <div className="flex flex-col gap-4">
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-red-300"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    handler={() => {
                        /* does nothing */
                    }}
                >
                    Delete
                </ActionButton>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-neutral-100"
                    textColor="text-purple-600"
                    textSize="text-sm"
                    handler={() => {
                        /* does nothing */
                    }}
                >
                    Cancel
                </ActionButton>
            </div>
        </div>
    )
}
