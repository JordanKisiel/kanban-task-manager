import axios from "axios"
import { config } from "./baseURL"
import { Board, Task, Column } from "@/types"
import prisma from "@/lib/prisma"

const DELAY_TIME = 3000

function delay(ms: number) {
    return new Promise((resolve) => {
        setTimeout(() => resolve("delay finished"), ms)
    })
}

function randomError(errorMessage: string, failureProbability: number) {
    if (Math.random() < failureProbability) {
        throw new Error(errorMessage)
    }
}

const BASE_URL = config.url

export async function getUserIdByEmail(sessionEmail: string) {
    //try to find already existing user
    const user = await prisma.user.findUnique({
        where: {
            email: sessionEmail,
        },
    })

    //user will be null if not found
    //in which case, create new user
    //TODO: maybe split this off into its
    //own function
    let newUser
    if (user === null) {
        newUser = await prisma.user.create({
            data: {
                email: sessionEmail,
            },
        })

        return newUser.id
    }

    //otherwise, we found a user
    return user.id
}

export async function getBoardById(boardId: number) {
    let response

    try {
        response = await axios.get(`${BASE_URL}/api/boards/${boardId}`)
    } catch (error) {
        console.error(error)
    }

    return response?.data as Board
}

export async function getBoardsByUser(userId: string) {
    let response

    try {
        response = await axios.get(`${BASE_URL}/api/boards?user=${userId}`)
    } catch (error) {
        console.error(error)
    }

    return response?.data as Board[]
}

export async function getTaskById(taskId: number | null) {
    let response

    try {
        response = await axios.get(`${BASE_URL}/api/tasks/${taskId}`)
    } catch (error) {
        console.error(error)
    }

    return response?.data as Task
}

export async function getTasksByColumn(colId: number) {
    let response

    try {
        response = await axios.get(`${BASE_URL}/api/tasks?colId=${colId}`)
    } catch (error) {
        console.error(error)
    }

    return response?.data as Task[]
}

export async function addBoard(boardData: {
    userId: string
    title: string
    columnTitles: string[]
}) {
    let response

    const columns = boardData.columnTitles.map((name) => {
        return {
            title: name,
        }
    })

    try {
        response = await axios.post(`${BASE_URL}/api/boards`, {
            userId: boardData.userId,
            title: boardData.title,
            columns,
        })
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
    //await delay(DELAY_TIME)

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
        response = await axios.post(`${BASE_URL}/api/tasks`, task)
    } catch (error) {
        console.error(error)
    }

    return response?.data
}

export async function deleteBoard(boardId: number) {
    //await delay(DELAY_TIME)

    try {
        await axios.delete(`${BASE_URL}/api/boards/${boardId}`)
    } catch (error) {
        console.error(error)
    }
}

export async function deleteTask(taskId: number) {
    //await delay(DELAY_TIME)

    try {
        await axios.delete(`${BASE_URL}/api/tasks/${taskId}`)
    } catch (error) {
        console.log(error)
    }
}

export async function editBoard(boardData: {
    boardId: number
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
}) {
    //await delay(DELAY_TIME)

    let response

    try {
        response = await axios.put(
            `${BASE_URL}/api/boards/${boardData.boardId}`,
            {
                boardId: boardData.boardId,
                title: boardData.title,
                columns: boardData.columns,
            }
        )
    } catch (error) {
        console.error(error)
    }

    return response?.data
}

export async function editTask(taskData: {
    taskId: number
    title: string
    description: string
    subTasks: {
        create: string[]
        update: {
            id: number
            description: string
        }[]
        delete: {
            id: number
        }[]
    }
    columnId: number | null
}) {
    //await delay(DELAY_TIME)

    let response

    try {
        response = await axios.put(`${BASE_URL}/api/tasks/${taskData.taskId}`, {
            taskId: taskData.taskId,
            title: taskData.title,
            description: taskData.description,
            subTasks: {
                create: [...taskData.subTasks.create],
                update: [...taskData.subTasks.update],
                delete: [...taskData.subTasks.delete],
            },
            columnId: taskData.columnId,
        })
    } catch (error) {
        console.error(error)
    }

    return response?.data
}

export async function editTaskOrderAndGrouping(orderingAndGroupingData: {
    ordering: { id: number; taskOrdering: number[] }[]
    grouping: ({ taskId: number; columnId: number } | null)[]
}) {
    let response

    try {
        response = await axios.put(`${BASE_URL}/api/columns`, {
            taskOrderings: orderingAndGroupingData.ordering,
            taskGroupings: orderingAndGroupingData.grouping,
        })
    } catch (error) {
        console.error(error)
    }

    return response?.data
}
