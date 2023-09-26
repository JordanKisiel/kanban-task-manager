export type Subtask = {
    isComplete: boolean
    description: string
}

export type Task = {
    title: string
    description: string
    subtasks: Subtask[]
}

export type Column = {
    title: string
    tasks: Task[]
}
