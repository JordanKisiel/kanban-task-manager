import { useState } from "react"
import Image from "next/image"
import {
    DndContext,
    DragEndEvent,
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    pointerWithin,
} from "@dnd-kit/core"
import TaskColumn from "@/components/app-elements/TaskColumn"
import ColumnSkeleton from "@/components/loading/ColumnSkeleton"
import Portal from "@/components/utilities/Portal"
import TaskCard from "@/components/app-elements/TaskCard"
import ActionButton from "@/components/ui-elements/ActionButton"
import addIconDark from "@/public/plus-icon.svg"
import addIconLight from "@/public/plus-icon-gray.svg"
import { useDarkMode } from "@/contexts/DarkModeProvider"
import { columnColors } from "@/lib/config"
import { Board, Task } from "@/types"

type Props = {
    board: Board | null
    selectedBoardIndex: number
    overlayTask: Task | null
    onDragStart: (event: DragStartEvent) => Promise<void>
    onDragOver: (event: DragOverEvent) => void
    onDragEnd: (event: DragEndEvent) => void
    dragDisabled: boolean
    isDragging: boolean
    setIsModalOpen: Function
    setModalMode: Function
    isPending: boolean
    numBoards: number
}

export default function BoardContent({
    board,
    selectedBoardIndex,
    overlayTask,
    onDragStart,
    onDragOver,
    onDragEnd,
    dragDisabled,
    isDragging,
    setIsModalOpen,
    setModalMode,
    isPending,
    numBoards,
}: Props) {
    const { isDarkMode } = useDarkMode()

    const NUM_SKELETON_COLS = 3

    const taskColumns =
        board !== null
            ? board.columns.map((column, index) => {
                  return (
                      <TaskColumn
                          key={column.id}
                          selectedBoardIndex={selectedBoardIndex}
                          columnId={column.id}
                          columnTitle={column.title}
                          taskOrdering={column.taskOrdering}
                          columnColor={
                              //mod the index so it loops back around to first color
                              columnColors[index % columnColors.length]
                          }
                          dragDisabled={dragDisabled}
                          isDragging={isDragging}
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
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
                collisionDetection={pointerWithin} //pointerWithin fixes infinite re-rendering issues
            >
                {taskColumns}
                <Portal>
                    {/* dropAnimation being set to null here fixes issue with item moving back
                        to original position for a few frames before order updating */}
                    <DragOverlay dropAnimation={null}>
                        {overlayTask && (
                            <TaskCard
                                task={overlayTask}
                                selectedBoardIndex={selectedBoardIndex}
                                dragDisabled={dragDisabled}
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

    return <>{content}</>
}
