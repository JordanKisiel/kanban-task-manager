type AddTaskFormData = {
    title: string
    description: string
    subTasks: string[]
    selectedIndex: number
    status: number
}

type AddTaskAction =
    | { type: "change_title"; title: string }
    | { type: "change_description"; description: string }
    | { type: "add_subTask"; text: string }
    | { type: "change_subTask"; id: string; text: string }
    | { type: "remove_subTask"; index: number }
    | { type: "change_status"; index: number; status: number }

export function addTaskReducer(
    formData: AddTaskFormData,
    action: AddTaskAction
) {
    switch (action.type) {
        case "change_title": {
            return {
                ...formData,
                title: action.title,
            }
        }
        case "change_description": {
            return {
                ...formData,
                description: action.description,
            }
        }
        case "add_subTask": {
            return {
                ...formData,
                subTasks: [...formData.subTasks, ""],
            }
        }
        case "change_subTask": {
            return {
                ...formData,
                subTasks: formData.subTasks.map((subTask, index) => {
                    if (`${index}` === action.id) {
                        return action.text
                    } else {
                        return subTask
                    }
                }),
            }
        }
        case "remove_subTask": {
            return {
                ...formData,
                subTasks: formData.subTasks.filter((subTask, index) => {
                    return index !== action.index
                }),
            }
        }
        case "change_status": {
            return {
                ...formData,
                selectedIndex: action.index,
                status: action.status,
            }
        }
        default: {
            throw Error(`Unknown action: ${JSON.stringify(action)}`)
        }
    }
}
