export type SubTask = {
    isCompleted: boolean
    description: string
}

export type Task = {
    title: string
    description: string
    subtasks: SubTask[]
    status: string
}
