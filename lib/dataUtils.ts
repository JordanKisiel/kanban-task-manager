import useSWR, { BareFetcher } from "swr"
import { config } from "./baseURL"
import { Board } from "@/types"

const BASE_URL = config.url

const bareFetcher: BareFetcher<any> = (url: string) =>
    fetch(url).then((r) => r.json())

export function useBoards(userId: string) {
    const { data, error, isLoading, mutate } = useSWR<Board[]>(
        `${BASE_URL}/api/boards?user=${userId}`,
        bareFetcher
    )

    return {
        boards: !data ? [] : data,
        isLoading,
        isError: error,
        mutate,
    }
}

export async function addBoard(
    userId: string,
    title: string,
    columnNames: string[]
) {
    let res

    const columns = columnNames.map((name) => {
        return {
            title: name,
        }
    })

    try {
        res = await fetch(`${BASE_URL}/api/boards`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId, title, columns }),
        })
    } catch (error) {
        console.error(error)
    }

    return res
}

export async function deleteBoard(boardId: number) {
    let res

    try {
        res = await fetch(`${BASE_URL}/api/boards`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ boardId }),
        })
    } catch (error) {
        console.error(error)
    }

    return res
}

export async function editBoard(
    boardId: number,
    formData: {
        title: string
        columns: {
            create: string[]
            update: {
                id: number
                title: string
            }[]
            delete: {
                id: number
            }[]
        }
    }
) {
    let res

    try {
        res = await fetch(`${BASE_URL}/api/boards`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                boardId,
                title: formData.title,
                columns: formData.columns,
            }),
        })
    } catch (error) {
        console.error(error)
    }

    return res
}

export async function addTask(formData: {
    title: string
    description: string
    subTasks: string[]
    selectedIndex: number
    status: number
}) {
    const task = {
        title: formData.title,
        description: formData.description,
        subTasks: formData.subTasks.map((subTask) => {
            return {
                description: subTask,
                isComplete: false,
            }
        }),
        columnId: formData.status,
    }

    let res

    try {
        res = await fetch(`${BASE_URL}/api/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        })
    } catch (error) {
        console.error(error)
    }

    return res
}

export async function deleteTask(taskId: number) {
    let res

    try {
        res = await fetch(`${BASE_URL}/api/tasks`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ taskId }),
        })
    } catch (error) {
        console.log(error)
    }

    return res
}

export async function editTask(
    taskId: number,
    formData: {
        title: string
        description: string
        subTasks: {
            create: string[]
            update: { id: number; description: string }[]
            delete: { id: number }[]
        }
        columnId: number | null
    }
) {
    let res

    try {
        res = await fetch(`${BASE_URL}/api/tasks`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                taskId,
                title: formData.title,
                description: formData.description,
                subTasks: formData.subTasks,
                columnId: formData.columnId,
            }),
        })
    } catch (error) {
        console.error(error)
    }

    return res
}
