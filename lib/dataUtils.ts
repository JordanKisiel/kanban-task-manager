import axios from "axios"
import { config } from "./baseURL"
import { Board, Task } from "@/types"

const DELAY_TIME = 1000

function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve("delay finished"), ms)
    })
}

const BASE_URL = config.url

export default axios.create({
    baseURL: BASE_URL,
})

export async function getBoardById(boardId: number) {
    let response

    try {
        response = await axios.get(`/api/boards/${boardId}`)
    } catch (error) {
        console.error(error)
    }

    return response?.data as Board
}

export async function getBoardsByUser(userId: string) {
    let response

    try {
        response = await axios.get(`/api/boards?user=${userId}`)
    } catch (error) {
        console.error(error)
    }

    return response?.data as Board[]
}

export async function getTaskById(taskId: number | null) {
    let response

    try {
        response = await axios.get(`/api/tasks/${taskId}`)
    } catch (error) {
        console.error(error)
    }

    return response?.data as Task
}

export async function getTasksByColumn(colId: number) {
    let response

    try {
        response = await axios.get(`/api/tasks?colId=${colId}`)
    } catch (error) {
        console.error(error)
    }

    return response?.data as Task[]
}

export async function addBoard(
    userId: string,
    title: string,
    columnNames: string[]
) {
    let response

    const columns = columnNames.map((name) => {
        return {
            title: name,
        }
    })

    try {
        response = await axios.post("/api/boards", { userId, title, columns })
    } catch (error) {
        console.error(error)
    }

    return response?.data
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

    let response

    try {
        response = await axios.post("/api/tasks", task)
    } catch (error) {
        console.error(error)
    }

    return response?.data
}

export async function deleteBoard(boardId: number) {
    try {
        await axios.delete(`/api/boards/${boardId}`)
    } catch (error) {
        console.error(error)
    }
}

export async function deleteTask(taskId: number) {
    try {
        await axios.delete(`/api/tasks/${taskId}`)
    } catch (error) {
        console.log(error)
    }
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
    //await delay(DELAY_TIME)

    let response

    try {
        response = await axios.put(`/api/boards/${boardId}`, {
            boardId,
            title: formData.title,
            columns: formData.columns,
        })
    } catch (error) {
        console.error(error)
    }

    return response?.data
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
    //await delay(DELAY_TIME)

    let response

    try {
        response = await axios.put(`/api/tasks/${taskId}`, {
            taskId,
            title: formData.title,
            description: formData.description,
            subTasks: formData.subTasks,
            columnId: formData.columnId,
        })
    } catch (error) {
        console.error(error)
    }

    return response?.data
}
