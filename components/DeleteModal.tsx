import { useState } from "react"
import { useRouter } from "next/navigation"
import ActionButton from "./ActionButton"
import { deleteBoard, deleteTask } from "@/lib/dataUtils"
import { useQuery } from "@tanstack/react-query"
import { boardByIdOptions, taskByIdOptions } from "@/lib/queries"
import { Board, Task } from "@/types"

type Props = {
    isBoard: boolean
    itemToDelete: Board | Task
    selectedBoardIndex: number
    setIsModalOpen: Function
    changeSelectedBoardIndex: Function
}

export default function DeleteModal({
    isBoard,
    itemToDelete,
    selectedBoardIndex,
    setIsModalOpen,
    changeSelectedBoardIndex,
}: Props) {
    const router = useRouter()

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    let userMessage = `Are you sure you want to delete the '${itemToDelete.title}
        ' board? This action will remove all columns and tasks and cannot be reversed.`

    if (!isBoard) {
        userMessage = `Are you sure you want to delete the '${itemToDelete.title}
        ' task and its subtasks? This action cannot be reversed.`
    }

    async function handleDelete() {
        setIsSubmitted(true)

        if (isBoard) {
            await deleteBoard(itemToDelete.id)
        } else {
            await deleteTask(itemToDelete.id)
        }

        //revalidating all data regardless of whether
        //we're deleting a task or board
        // if (deleteRes && deleteRes.ok) {
        //     mutate(boards, { revalidate: true })
        // }

        if (isBoard) {
            changeSelectedBoardIndex(0)
        }

        setIsModalOpen(false)

        router.push(`/?board=${selectedBoardIndex}`)
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
