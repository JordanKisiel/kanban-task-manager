import { queryOptions } from "@tanstack/react-query"
import {
    getBoardsByUser,
    getBoardById,
    getTasksByColumn,
    getTaskById,
} from "./dataUtils"

export function boardsByUserOptions(userId: string) {
    return queryOptions({
        queryKey: ["boardsData", userId],
        queryFn: () => {
            return getBoardsByUser(userId)
        },
    })
}

export function boardByIdOptions(boardId: number) {
    return queryOptions({
        queryKey: ["boardData", boardId],
        queryFn: () => getBoardById(boardId),
    })
}

export function tasksByColumnOptions(colId: number, taskOrdering: number[]) {
    return queryOptions({
        queryKey: ["tasksData", colId],
        queryFn: () => getTasksByColumn(colId),
        //this sort is O(n^2) but the numbers we're dealing with are small
        select: (data) =>
            data.toSorted((a, b) => {
                return taskOrdering.indexOf(a.id) - taskOrdering.indexOf(b.id)
            }),
    })
}

export function taskByIdOptions(taskId: number | null) {
    return queryOptions({
        queryKey: ["taskData", taskId],
        queryFn: () => getTaskById(taskId),
        enabled: taskId !== null,
    })
}
