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
