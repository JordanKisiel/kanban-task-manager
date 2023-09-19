export type SubTask = {
    isComplete: boolean
    description: string
}

export type Task = {
    title: string
    description: string
    subtasks: SubTask[]
}

export type Column = {
    title: string
    tasks: Task[]
}
