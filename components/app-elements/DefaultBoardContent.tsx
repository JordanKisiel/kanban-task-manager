import {
    DndContext,
    DragStartEvent,
    DragOverEvent,
    DragEndEvent,
    DragOverlay,
    pointerWithin,
} from "@dnd-kit/core"
import TaskColumn from "@/components/app-elements/TaskColumn"
import TaskCard from "@/components/app-elements/TaskCard"
import NewColumn from "@/components/app-elements/NewColumn"
import Portal from "@/components/utilities/Portal"
import { Board, Task } from "@/types"
import { columnColors } from "@/lib/config"

type Props = {
    board: Board | null
    selectedBoardIndex: number
    onDragStart: (event: DragStartEvent) => Promise<void>
    onDragOver: (event: DragOverEvent) => void
    onDragEnd: (event: DragEndEvent) => void
    isDragging: boolean
    dragDisabled: boolean
    overlayTask: Task | null
    setIsModalOpen: Function
    setModalMode: Function
    isDarkMode: boolean
}

export default function DefaultBoardContent({
    board,
    selectedBoardIndex,
    onDragStart,
    onDragOver,
    onDragEnd,
    isDragging,
    dragDisabled,
    overlayTask,
    setIsModalOpen,
    setModalMode,
    isDarkMode,
}: Props) {
    const taskColumns =
        board !== null && board.columns
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

    return (
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
            <NewColumn
                setIsModalOpen={setIsModalOpen}
                setModalMode={setModalMode}
                isDarkMode={isDarkMode}
            />
        </div>
    )
}
