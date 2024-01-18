export type SubTask = {
    id: number
    isComplete: boolean
    description: string
}

export type Task = {
    id: number
    title: string
    description: string
    subTasks: SubTask[]
    columnId: number | null
}

export type Column = {
    id: number
    title: string
    tasks: Task[]
    taskOrdering: number[]
}

export type Board = {
    id: number
    title: string
    columns: Column[]
}

export type ModalMode =
    | "viewTask"
    | "editTask"
    | "deleteTask"
    | "addTask"
    | "addBoard"
    | "editBoard"
    | "deleteBoard"
