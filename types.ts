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
    columnId: number
}

export type Column = {
    id: number
    title: string
    tasks: Task[]
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
