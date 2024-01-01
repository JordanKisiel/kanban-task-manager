import { useState } from "react"
import { useRouter } from "next/navigation"
import ActionButton from "./ActionButton"
import { deleteBoard, deleteTask } from "@/lib/dataUtils"
import { Board, Task } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Props = {
    isBoard: boolean
    itemToDelete: Board | Task | null
    setIsModalOpen: Function
    changeSelectedBoardIndex: Function
}

export default function DeleteModal({
    isBoard,
    itemToDelete,
    setIsModalOpen,
    changeSelectedBoardIndex,
}: Props) {
    const queryClient = useQueryClient()

    const deleteBoardMutation = useMutation({
        mutationFn: deleteBoard,
        onMutate: () => setIsSubmitted(true),
        onSuccess: () => {
            console.log("success?")
            changeSelectedBoardIndex(0)
            queryClient.invalidateQueries({ queryKey: ["boardsData"] })
            setIsModalOpen(false)
        },
        onError: () => {
            setIsSubmitted(false)
            //TODO: surface error to user in UI
            console.log("There was an error. Please try again.")
        },
    })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    let userMessage =
        "There doesn't appear to be an item to delete. Try refreshing the page."

    if (itemToDelete !== null) {
        userMessage = `Are you sure you want to delete the '${itemToDelete.title}
        ' board? This action will remove all columns and tasks and cannot be reversed.`

        if (!isBoard) {
            userMessage = `Are you sure you want to delete the '${itemToDelete.title}
        ' task and its subtasks? This action cannot be reversed.`
        }
    }

    async function handleDelete() {
        if (itemToDelete !== null) {
            if (isBoard) {
                deleteBoardMutation.mutate(itemToDelete.id)
            } else {
                await deleteTask(itemToDelete.id)
            }
        }
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
                        handleDelete()
                    }}
                    isDisabled={isSubmitted}
                    isLoading={isSubmitted}
                >
                    Delete
                </ActionButton>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-neutral-300 dark:bg-neutral-100"
                    textColor="text-purple-600"
                    textSize="text-sm"
                    handler={() => setIsModalOpen()}
                    isDisabled={isSubmitted}
                >
                    Cancel
                </ActionButton>
            </div>
        </div>
    )
}
