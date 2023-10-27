import { config } from "./baseURL"

const BASE_URL = config.url

export async function getBoards(userId: string) {
    const res = await fetch(`${BASE_URL}/api/boards?user=${userId}`)

    if (!res.ok) {
        throw new Error("Failed to fetch data")
    }

    return res
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

    try {
        await fetch(`${BASE_URL}/api/tasks`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(task),
        })
    } catch (error) {
        console.error(error)
    }
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
