"use client"

import { useState, useRef } from "react"
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
    DragOverEvent,
    DragOverlay,
    DragStartEvent,
    pointerWithin,
} from "@dnd-kit/core"
import TaskCard from "@/components/app-elements/TaskCard"
import Portal from "@/components/utilities/Portal"
import { QueryKey, useMutation, useQueryClient } from "@tanstack/react-query"
import { editTaskOrderAndGrouping } from "@/lib/dataUtils"
import { arraySwap } from "@dnd-kit/sortable"
import { useParams } from "next/navigation"
import { useDarkMode } from "@/contexts/DarkModeProvider"
import { columnColors } from "@/lib/config"

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

    const [overlayTask, setOverlayTask] = useState<Task | null>(null)

    //used to hold snapshot of previous boards data in case of having to revert
    let preDragBoardSnapShot = useRef<Board[] | undefined | null>(null)

    const [dragDisabled, setDragDisabled] = useState(false)
    const [isDragging, setIsDragging] = useState(false)

    const { isDarkMode } = useDarkMode()

    const params = useParams<{ user: string }>()

    const queryClient = useQueryClient()

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
                    context.preDragBoardSnapShot
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
                        to original position for a few frames before ordering updating */}
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

    async function onDragStart(event: DragStartEvent) {
        console.log("START")

        setIsDragging(true)

        //store the dragged task in state
        if (event.active.data.current?.type === "Task") {
            setOverlayTask(event.active.data.current.task)
        }

        //snapshot the previous tasks
        // const previousTasks: [QueryKey, unknown][] | undefined =
        //     queryClient.getQueriesData({ queryKey: ["tasksData"] })
        // preDragTasksSnapShot.current = previousTasks

        //snapshot the previous boards
        //specifically the taskOrdering data
        const previousBoards: Board[] | undefined = queryClient.getQueryData([
            "boardsData",
            params.user,
        ])
        preDragBoardSnapShot.current = previousBoards

        //cancel any outgoing queries to avoid refreshes
        //interrupting user dragging
        //cancel outgoing refetches to stop
        //overwriting of optimistic update
        await queryClient.cancelQueries()
    }

    function onDragOver(event: DragOverEvent) {
        console.log("OVER")

        const {
            over,
            activeTask,
            isOverTask,
            isActiveOverSelf,
            isSameColumn,
            isOverDifferentColumn,
            isOverColumnEmpty,
            overTask,
            isDifferentContainingCol,
        } = getDragEventData(event)

        //get reference to cached task data for local manipulation
        let newTasks = queryClient.getQueriesData<Task[]>({
            queryKey: ["tasksData"],
        })

        //Guard against certain conditions:

        //if not over a valid element, do nothing
        if (!over) return

        //if the task is over itself, do nothing
        if (isActiveOverSelf) return

        const {
            activeTaskData,
            activeTaskItems,
            overColTaskData,
            overColTaskItems,
        } = getTaskDragData(newTasks, event)

        // Account for 4 conditions when dragging and dropping:

        // Condition 1 - task is over task in same column

        if (isOverTask && isSameColumn && activeTaskData && activeTaskItems) {
            const activeTaskIndex = activeTaskItems.findIndex((task) => {
                return task.id === activeTask.id
            })

            const overTaskIndex = activeTaskItems.findIndex((task) => {
                return task.id === over.id
            })

            //swap positions of active and over task
            activeTaskData[1] = arraySwap(
                activeTaskItems,
                activeTaskIndex,
                overTaskIndex
            )
        }

        //Condition 2 - Task is over different empty column

        if (
            isOverDifferentColumn &&
            isOverColumnEmpty &&
            activeTaskData &&
            activeTaskItems &&
            overColTaskData &&
            overColTaskItems
        ) {
            //remove task from current column

            const activeTaskIndex = activeTaskItems.findIndex((task) => {
                return task.id === activeTask.id
            })

            activeTaskItems.splice(activeTaskIndex, 1)

            //add task to over column

            overColTaskItems.push(activeTask)

            activeTask.columnId = over.id
        }

        // Condition 3 - Task is over task in different column

        if (
            isOverTask &&
            isDifferentContainingCol &&
            activeTaskData &&
            activeTaskItems &&
            overColTaskData &&
            overColTaskItems
        ) {
            //remove active task from original containing column
            const activeTaskIndex = activeTaskItems.findIndex((item) => {
                return item.id === activeTask.id
            })

            activeTaskItems.splice(activeTaskIndex, 1)

            // splice active task in at index of over task

            const overTaskIndex = overColTaskItems.findIndex((item) => {
                return item.id === overTask.id
            })

            overColTaskItems.splice(overTaskIndex, 0, activeTask)

            console.log(JSON.stringify(overColTaskItems))

            // also make sure to change col id so that condition 1
            // can trigger for subsequent dragover events

            activeTask.columnId = overTask.columnId
        }

        // Condition 4 - Task is over different & non-empty column
        if (
            isOverDifferentColumn &&
            !isOverColumnEmpty &&
            activeTaskData &&
            activeTaskItems &&
            overColTaskData &&
            overColTaskItems
        ) {
            //remove active task from original containing column
            const activeTaskIndex = activeTaskItems.findIndex((item) => {
                return item.id === activeTask.id
            })

            activeTaskItems.splice(activeTaskIndex, 1)

            //push active task to end of over containing column
            overColTaskItems.push(activeTask)

            // also make sure to change col id so that condition 1
            // can trigger for subsequent dragover events
            activeTask.columnId = over.id
        }

        //update the local cache with the new task items data
        newTasks.forEach((taskData) => {
            queryClient.setQueryData(["tasksData", taskData[0][1]], taskData[1])
        })

        //get reference to board cache data for local manipulation
        //specifically to write taskOrderings
        let newBoards: Board[] | undefined = queryClient.getQueryData([
            "boardsData",
            params.user,
        ])

        //write updated ordering to local cache
        if (newBoards) {
            const newActiveBoard = newBoards.filter((newBoard) => {
                return newBoard.id === board?.id
            })[0]

            //write taskOrdering to each column
            newActiveBoard.columns.forEach((column) => {
                const columnTaskData = newTasks.find((tasks) => {
                    const tasksColId = tasks[0][1]

                    return tasksColId === column.id
                })

                const columnTasks =
                    columnTaskData && columnTaskData[1] ? columnTaskData[1] : []

                column.taskOrdering = columnTasks.map((task) => {
                    return task.id
                })
            })
        }
    }

    function onDragEnd(event: DragEndEvent) {
        console.log("END")

        setIsDragging(false)

        //remove overlay as it's no longer needed
        setOverlayTask(null)

        //get boards data after changes made by onDragOver
        const newBoards: Board[] | undefined = queryClient.getQueryData([
            "boardsData",
            params.user,
        ])

        //get tasks data after changes made by onDragOver
        const newTasks = queryClient.getQueriesData<Task[]>({
            queryKey: ["tasksData"],
        })

        if (newBoards && newTasks) {
            const activeBoard = newBoards.filter(
                (newBoard) => newBoard.id === board?.id
            )[0]

            const activeTaskColumns = newTasks.map((queryData) => {
                const tasks = queryData[1]

                return tasks
            })

            const activeTasks = activeTaskColumns.flat().map((task) => {
                if (task && task.columnId) {
                    return {
                        taskId: task.id,
                        columnId: task.columnId,
                    }
                }

                return null
            })

            //updates all task orderings for the active board
            editTaskOrderingMutation.mutate({
                ordering: activeBoard.columns.map((column) => {
                    return {
                        id: column.id,
                        taskOrdering: column.taskOrdering,
                    }
                }),
                grouping: activeTasks,
            })
        }
    }

    //derive data to be used in drag handler
    function getDragEventData(event: DragOverEvent) {
        const { active, over } = event

        const activeTask = active.data.current?.task
        const overId = over ? over.id : -1
        const isOverTask = over?.data.current?.type === "Task"
        const isActiveOverSelf = activeTask.id === overId && isOverTask
        const isSameColumn =
            activeTask.columnId === over?.data.current?.task?.columnId
        const isOverColumn = over?.data.current?.type === "Column"
        const isOverDifferentColumn =
            isOverColumn && activeTask.columnId !== overId
        const isOverColumnEmpty = over?.data.current?.tasks?.length === 0
        const overTask = over?.data.current?.task
        const isDifferentContainingCol = isOverTask
            ? activeTask.columnId !== overTask.columnId
            : false

        return {
            active,
            over,
            overTask,
            activeTask,
            isOverTask,
            isActiveOverSelf,
            isSameColumn,
            isOverColumn,
            isOverDifferentColumn,
            isOverColumnEmpty,
            isDifferentContainingCol,
        }
    }

    //returns the active and over data based on task data and dragover event
    function getTaskDragData(
        cachedTaskData: [QueryKey, Task[] | undefined][],
        event: DragOverEvent
    ) {
        const activeTask = event.active?.data.current?.task

        //get the column and tasks associated with the active task
        const activeTaskData = cachedTaskData.find((queryData) => {
            const query = queryData[0]
            const colId = query[1]

            return colId === activeTask?.columnId
        })

        const activeTaskItems = activeTaskData ? activeTaskData[1] : null

        //get the column and tasks associated with the over item
        const overColTaskData = cachedTaskData.find((queryData) => {
            const isOverTask = event.over?.data.current?.type === "Task"
            const overTask = event.over?.data.current?.task

            const query = queryData[0]
            const colId = query[1]

            //over a task? match the colId
            //over a column? match the id
            return isOverTask
                ? colId === overTask.columnId
                : colId === event.over?.id
        })

        const overColTaskItems = overColTaskData ? overColTaskData[1] : null

        return {
            activeTaskData,
            activeTaskItems,
            overColTaskData,
            overColTaskItems,
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
