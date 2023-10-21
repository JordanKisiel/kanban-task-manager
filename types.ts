export type Subtask = {
    isComplete: boolean
    description: string
}

export type Task = {
    title: string
    description: string
    subTasks: Subtask[]
}

export type Column = {
    title: string
    tasks: Task[]
}

export type Board = {
    title: string
    columns: Column[]
}
