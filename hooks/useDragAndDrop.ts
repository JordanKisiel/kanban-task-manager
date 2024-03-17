import { useState, useRef, MutableRefObject } from "react"
import { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core"
import { arraySwap } from "@dnd-kit/sortable"
import { Board, Task } from "@/types"
import { QueryClient, UseMutationResult, QueryKey } from "@tanstack/react-query"

export function useDragAndDrop(
    queryClient: QueryClient,
    userId: string,
    currentBoard: Board | null,
    taskMutation: UseMutationResult<
        any,
        Error,
        {
            ordering: {
                id: number
                taskOrdering: number[]
            }[]
            grouping: ({
                taskId: number
                columnId: number
            } | null)[]
        },
        {
            preDragBoardSnapShot: MutableRefObject<Board[] | null | undefined>
        }
    >
) {
    const [dragDisabled, setDragDisabled] = useState(false)
    const [isDragging, setIsDragging] = useState(false)
    //ui element used to indicate potential drop position
    const [overlayTask, setOverlayTask] = useState<Task | null>(null)
    //used to hold snapshot of previous boards data in case of having to revert
    const preDragBoardSnapShot = useRef<Board[] | undefined | null>(null)

    async function onDragStart(event: DragStartEvent) {
        setIsDragging(true)

        //store the dragged task in state
        if (event.active.data.current?.type === "Task") {
            setOverlayTask(event.active.data.current.task)
        }

        //snapshot the previous boards
        const previousBoards: Board[] | undefined = queryClient.getQueryData([
            "boardsData",
            userId,
        ])
        preDragBoardSnapShot.current = previousBoards

        //cancel any outgoing queries to avoid refreshes
        //interrupting user dragging
        //cancel outgoing refetches to stop
        //overwriting of optimistic update
        await queryClient.cancelQueries()
    }

    function onDragOver(event: DragOverEvent) {
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
            userId,
        ])

        //write updated ordering to local cache
        if (newBoards) {
            const newActiveBoard = newBoards.filter((newBoard) => {
                return newBoard.id === currentBoard?.id
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
        setIsDragging(false)

        //remove overlay as it's no longer needed
        setOverlayTask(null)

        //get boards data after changes made by onDragOver
        const newBoards: Board[] | undefined = queryClient.getQueryData([
            "boardsData",
            userId,
        ])

        //get tasks data after changes made by onDragOver
        const newTasks = queryClient.getQueriesData<Task[]>({
            queryKey: ["tasksData"],
        })

        if (newBoards && newTasks) {
            const activeBoard = newBoards.filter(
                (newBoard) => newBoard.id === currentBoard?.id
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
            taskMutation.mutate({
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

    return {
        onDragStart,
        onDragOver,
        onDragEnd,
        isDragging,
        dragDisabled,
        setDragDisabled,
        overlayTask,
        preDragBoardSnapShot,
    }
}
