import { queryOptions } from "@tanstack/react-query"
import {
    getBoardsByUser,
    getBoardById,
    getTasksByColumn,
    getTaskById,
} from "./dataUtils"
import { Board, Task } from "@/types"

export function boardsByUserOptions(userId: string) {
    return queryOptions({
        queryKey: ["boardsData", userId],
        queryFn: () => getBoardsByUser(userId),
        initialData: [],
    })
}

export function boardByIdOptions(boardId: number) {
    return queryOptions({
        queryKey: ["boardData", boardId],
        queryFn: () => getBoardById(boardId),
        initialData: {} as Board,
    })
}

export function tasksByColumnOptions(colId: number) {
    return queryOptions({
        queryKey: ["tasksData", colId],
        queryFn: () => getTasksByColumn(colId),
        initialData: [],
    })
}

export function taskByIdOptions(taskId: number | null) {
    return queryOptions({
        queryKey: ["taskData", taskId],
        queryFn: () => getTaskById(taskId),
        initialData: {} as Task,
        enabled: taskId !== null,
    })
}
