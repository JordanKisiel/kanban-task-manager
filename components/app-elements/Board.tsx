"use client"

import Modal from "@/components/modals/Modal"
import { useModal } from "@/hooks/useModal"
import EditBoardModal from "@/components/modals/EditBoardModal"
import { Board } from "@/types"
import AddBoardModal from "@/components/modals/AddBoardModal"
import DefaultBoardContent from "@/components/app-elements/DefaultBoardContent"
import EmptyBoardContent from "@/components/app-elements/EmptyBoardContent"
import NewUserBoardContent from "@/components/app-elements/NewUserBoardContent"
import BoardSkeleton from "@/components/loading/BoardSkeleton"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editTaskOrderAndGrouping } from "@/lib/dataUtils"
import { useParams } from "next/navigation"
import { useDragAndDrop } from "@/hooks/useDragAndDrop"
import { useDarkMode } from "@/contexts/DarkModeProvider"
import { NUM_SKELETON_COLS } from "@/lib/config"

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

    const { isDarkMode } = useDarkMode()

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

    let content: React.ReactNode
    if (isPending) {
        content = <BoardSkeleton numColumns={NUM_SKELETON_COLS} />
    } else if (numBoards === 0) {
        content = (
            <NewUserBoardContent
                setIsModalOpen={setIsModalOpen}
                setModalMode={setModalMode}
                isDarkMode={isDarkMode}
            />
        )
    } else if (board && board.columns.length === 0) {
        content = (
            <EmptyBoardContent
                setIsModalOpen={setIsModalOpen}
                setModalMode={setModalMode}
                isDarkMode={isDarkMode}
            />
        )
    } else {
        console.log("board")
        console.log(JSON.stringify(board))
        console.log("columns")
        console.log(JSON.stringify(board?.columns))
        content = (
            <DefaultBoardContent
                board={board}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                overlayTask={overlayTask}
                dragDisabled={dragDisabled}
                isDragging={isDragging}
                selectedBoardIndex={selectedBoardIndex}
                setIsModalOpen={setIsModalOpen}
                setModalMode={setModalMode}
                isDarkMode={isDarkMode}
            />
        )
    }

    return (
        <>
            {content}
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
