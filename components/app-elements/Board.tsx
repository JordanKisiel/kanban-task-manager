"use client"

import { useState } from "react"
import Image from "next/image"
import TaskColumn from "@/components/app-elements/TaskColumn"
import Modal from "@/components/modals/Modal"
import ActionButton from "@/components/ui-elements/ActionButton"
import ColumnSkeleton from "@/components/loading/ColumnSkeleton"
import addIconDark from "@/public/plus-icon.svg"
import addIconLight from "@/public/plus-icon-gray.svg"
import { useModal } from "@/hooks/useModal"
import EditBoardModal from "@/components/modals/EditBoardModal"
import { Board, Task } from "@/types"
import AddBoardModal from "@/components/modals/AddBoardModal"
import {
    DndContext,
    DragEndEvent,
    DragOverlay,
    DragStartEvent,
} from "@dnd-kit/core"
import TaskCard from "./TaskCard"
import Portal from "@/components/utilities/Portal"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { editTaskOrdering } from "@/lib/dataUtils"
import { arrayMove } from "@dnd-kit/sortable"

type Props = {
    board: Board | null
    isPending: boolean
    numBoards: number
    isDarkMode: boolean
    selectedBoardIndex: number
    setNewBoardCreated: Function
}

export default function Board({
    board,
    isPending,
    numBoards,
    isDarkMode,
    selectedBoardIndex,
    setNewBoardCreated,
}: Props) {
    const [isModalOpen, setIsModalOpen, modalMode, setModalMode] = useModal(
        "editBoard",
        false
    )

    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const queryClient = useQueryClient()

    //TODO: make this optimistic after getting non-optimistic to work
    const editTaskOrderingMutation = useMutation({
        mutationFn: editTaskOrdering,
        onMutate: () => {
            //disable dragging?
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boardsData"] })
        },
        onError: () => {
            //in final version, rollback on error
            console.log("There was an error. Please try again")
        },
    })

    const NUM_SKELETON_COLS = 3

    const columnColors = [
        "bg-[#49C4E5]",
        "bg-[#8471F2]",
        "bg-[#67E2AE]",
        "bg-[#E2B867]",
        "bg-[#E26767]",
        "bg-[#6782E2]",
        "bg-[#96E267]",
        "bg-[#D7D143]",
        "bg-[#C543C8]",
    ]

    const taskColumns =
        board !== null
            ? board.columns.map((column, index) => {
                  return (
                      <TaskColumn
                          key={column.title}
                          selectedBoardIndex={selectedBoardIndex}
                          columnId={column.id}
                          columnTitle={column.title}
                          taskOrdering={column.taskOrdering}
                          columnColor={
                              //mod the index so it loops back around to first color
                              columnColors[index % columnColors.length]
                          }
                      />
                  )
              })
            : []

    const skeletonColumns = Array(NUM_SKELETON_COLS)
        .fill("")
        .map((column, index) => {
            return (
                <ColumnSkeleton
                    key={index}
                    numTaskCardSkeletons={3}
                />
            )
        })

    const boardDisplay = (
        <div className="grid grid-flow-col auto-cols-[16rem] px-6 py-20 gap-6 overflow-auto md:pt-5 md:pb-20">
            <DndContext
                onDragStart={onDragStart}
                onDragEnd={onDragEnd}
            >
                {taskColumns}
                <Portal>
                    <DragOverlay>
                        {activeTask && (
                            <TaskCard
                                selectedBoardIndex={selectedBoardIndex}
                                taskId={activeTask.id}
                            />
                        )}
                    </DragOverlay>
                </Portal>
            </DndContext>
            <div className="flex flex-col pt-[2.3rem] h-full justify-center">
                <button
                    onClick={() => {
                        setIsModalOpen(true)
                        setModalMode("editBoard")
                    }}
                    className="
                        flex flex-row text-neutral-500 dark:text-neutral-400 bg-neutral-300/50 
                        dark:bg-neutral-700/20 text-2xl font-bold items-center gap-2 w-full h-full 
                        justify-center rounded"
                >
                    <Image
                        className="mt-[0.5rem] opacity-50"
                        src={isDarkMode ? addIconDark : addIconLight}
                        alt="Add icon"
                        width={12}
                        height={12}
                    />
                    New Column
                </button>
            </div>
        </div>
    )

    const skeletonBoard = (
        <div className="grid grid-flow-col auto-cols-[16rem] px-6 py-20 gap-6 overflow-auto md:pt-5 md:pb-20">
            {skeletonColumns}
        </div>
    )

    const emptyBoard = (
        <div className="flex flex-col grow items-center min-h-fit justify-center w-full h-full">
            <div className="flex flex-col items-center">
                <p className="text-neutral-500 text-center w-[80%] text-lg font-bold leading-6 mb-6 -mt-12">
                    This board is empty. Create a new column to get started.
                </p>
                <ActionButton
                    isWidthFull={false}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => {
                        setIsModalOpen(true)
                        setModalMode("editBoard")
                    }}
                >
                    <Image
                        className="w-[5%] mt-[0.2rem]"
                        src={isDarkMode ? addIconDark : addIconLight}
                        alt="Add icon"
                        width={12}
                        height={12}
                    />
                    <span>Add New Column</span>
                </ActionButton>
            </div>
        </div>
    )

    const newUserPrompt = (
        <div className="flex flex-col grow items-center min-h-fit justify-center w-full h-full">
            <div className="flex flex-col items-center">
                <p className="text-neutral-500 text-center w-[80%] text-lg font-bold leading-6 mb-6 -mt-12">
                    You don't seem to have any boards. Try creating one!
                </p>
                <ActionButton
                    isWidthFull={false}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => {
                        setIsModalOpen(true)
                        setModalMode("addBoard")
                    }}
                >
                    <Image
                        className="w-[5%] mt-[0.2rem]"
                        src={isDarkMode ? addIconDark : addIconLight}
                        alt="Add icon"
                        width={12}
                        height={12}
                    />
                    <span>Create New Board</span>
                </ActionButton>
            </div>
        </div>
    )

    let content: React.ReactNode
    if (isPending) {
        content = skeletonBoard
    } else if (numBoards === 0) {
        content = newUserPrompt
    } else if (board && board.columns.length === 0) {
        content = emptyBoard
    } else {
        content = boardDisplay
    }

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

    function onDragStart(event: DragStartEvent) {
        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event

        //if not over a valid element, do nothing
        if (!over) return

        const activeTaskId = active.id
        const overTaskId = over.id

        //if the task is over itself, do nothing
        if (activeTaskId === overTaskId) return

        //grab the columnId associated with the task
        //and use it get a reference to the current column
        const activeColumnId = active.data.current?.task.columnId
        const activeColumn = board?.columns.find(
            (column) => column.id === activeColumnId
        )

        const activeTaskIndex = activeColumn?.taskOrdering.findIndex(
            (taskId) => taskId === activeTaskId
        )
        const overTaskIndex = activeColumn?.taskOrdering.findIndex(
            (taskId) => taskId === overTaskId
        )

        //use data to mutate the taskOrdering field of the given column
        if (
            activeColumn?.taskOrdering &&
            activeTaskIndex !== undefined &&
            overTaskIndex !== undefined
        ) {
            editTaskOrderingMutation.mutate({
                columnId: activeColumnId,
                taskOrdering: arrayMove(
                    activeColumn?.taskOrdering,
                    activeTaskIndex,
                    overTaskIndex
                ),
            })
        }
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
