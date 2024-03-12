"use client"

import Modal from "@/components/modals/Modal"
import { useModal } from "@/hooks/useModal"
import EditBoardModal from "@/components/modals/EditBoardModal"
import { Board } from "@/types"
import AddBoardModal from "@/components/modals/AddBoardModal"
import BoardContent from "@/components/app-elements/BoardContent"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editTaskOrderAndGrouping } from "@/lib/dataUtils"
import { useParams } from "next/navigation"
import { useDragAndDrop } from "@/hooks/useDragAndDrop"

type Props = {
    board: Board | null
    isPending: boolean
    numBoards: number
    selectedBoardIndex: number
    setNewBoardCreated: Function
}

export default function Board({
    board,
    isPending,
    numBoards,
    selectedBoardIndex,
    setNewBoardCreated,
}: Props) {
    const [isModalOpen, setIsModalOpen, modalMode, setModalMode] = useModal(
        "editBoard",
        false
    )

    const queryClient = useQueryClient()
    const params = useParams<{ user: string }>()

    const editTaskOrderingMutation = useMutation({
        mutationFn: editTaskOrderAndGrouping,
        onMutate: (sentOrderingData) => {
            //disable dragging while mutation in progress
            setDragDisabled(true)

            //return context
            return { preDragBoardSnapShot }
        },
        onError: (err, newBoards, context) => {
            //rollback on error
            console.log(err)
            if (context) {
                queryClient.setQueryData(
                    ["boardsData", params.user],
                    context.preDragBoardSnapShot.current
                )
            }
        },
        //refetch regardless of error or success
        onSettled: () => {
            // queryClient.invalidateQueries({
            //     queryKey: ["boardsData", params.user],
            // })

            queryClient.invalidateQueries()

            //re-enable dragging
            setDragDisabled(false)
        },
    })

    //use data manipulation and user data to
    //produce drag and drop handlers and state
    //not very re-usable but at least extracts the
    //dnd logic
    const {
        onDragStart,
        onDragOver,
        onDragEnd,
        overlayTask,
        isDragging,
        dragDisabled,
        setDragDisabled,
        preDragBoardSnapShot,
    } = useDragAndDrop(
        queryClient,
        params.user,
        board,
        editTaskOrderingMutation
    )

    let modalContent: React.ReactElement = <></>

    if (modalMode === "addBoard") {
        modalContent = (
            <AddBoardModal
                selectedBoardIndex={selectedBoardIndex}
                setIsModalOpen={setIsModalOpen}
                setNewBoardCreated={setNewBoardCreated}
            />
        )
    }

    if (modalMode === "editBoard" && board) {
        modalContent = (
            <EditBoardModal
                selectedBoardIndex={selectedBoardIndex}
                board={board}
                setIsModalOpen={setIsModalOpen}
            />
        )
    }

    return (
        <>
            <BoardContent
                board={board}
                isPending={isPending}
                numBoards={numBoards}
                selectedBoardIndex={selectedBoardIndex}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                isDragging={isDragging}
                dragDisabled={dragDisabled}
                overlayTask={overlayTask}
                setIsModalOpen={setIsModalOpen}
                setModalMode={setModalMode}
            />
            {isModalOpen && (
                <Modal
                    selectedBoardIndex={selectedBoardIndex}
                    setIsModalOpen={setIsModalOpen}
                >
                    {modalContent}
                </Modal>
            )}
        </>
    )
}
