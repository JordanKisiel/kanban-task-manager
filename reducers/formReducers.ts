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

type AddBoardFormData = {
    title: string
    columnTitles: string[]
}

type AddBoardAction =
    | { type: "add_column"; text: string }
    | { type: "change_column"; id: string; text: string }
    | { type: "delete_column"; index: number }
    | { type: "change_title"; text: string }

export function addBoardReducer(
    formData: AddBoardFormData,
    action: AddBoardAction
) {
    switch (action.type) {
        case "add_column": {
            return {
                ...formData,
                columnTitles: [...formData.columnTitles, ""],
            }
        }
        case "change_column": {
            return {
                ...formData,
                columnTitles: formData.columnTitles.map(
                    (columnTitle, index) => {
                        if (index.toString() === action.id) {
                            return action.text
                        } else {
                            return columnTitle
                        }
                    }
                ),
            }
        }
        case "delete_column": {
            return {
                ...formData,
                columnTitles: formData.columnTitles.filter(
                    (columnTitle, index) => {
                        return index !== action.index
                    }
                ),
            }
        }
        case "change_title": {
            return {
                ...formData,
                title: action.text,
            }
        }
        default: {
            throw Error(`Unknown action: ${JSON.stringify(action)}`)
        }
    }
}

type EditBoardFormData = {
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

type EditBoardAction =
    | { type: "change_title"; text: string }
    | { type: "add_column"; text: string }
    | { type: "change_column"; index: number; text: string }
    | { type: "remove_column"; index: number }

export function editBoardReducer(
    formData: EditBoardFormData,
    action: EditBoardAction
) {
    switch (action.type) {
        case "change_title": {
            return {
                ...formData,
                title: action.text,
            }
        }
        case "add_column": {
            return {
                ...formData,
                columns: {
                    ...formData.columns,
                    create: [...formData.columns.create, action.text],
                },
            }
        }
        // mapping the CREATE array:
        //   -we look for (inputIndex - UPDATE.length) === index
        //   -because the update array is always rendered before the create array
        // mapping the UPDATE array:
        //   -we look for inputIndex === index
        // and there is never mapping for DELETE
        //   -because it's never rendered
        case "change_column": {
            return {
                ...formData,
                columns: {
                    create: formData.columns.create.map((column, index) => {
                        if (
                            action.index - formData.columns.update.length ===
                            index
                        ) {
                            return action.text
                        } else {
                            return column
                        }
                    }),
                    update: formData.columns.update.map((column, index) => {
                        if (action.index === index) {
                            return {
                                id: column.id,
                                title: action.text,
                            }
                        } else {
                            return column
                        }
                    }),
                    delete: [...formData.columns.delete],
                },
            }
        }
        // filtering the CREATE array:
        //   -we look for (inputIndex - UPDATE.length) !== index
        //   -because the update array is always rendered before the create array
        // filtering the UPDATE array:
        //   -we look for inputIndex !== index
        // for the DELETE array:
        //   -we look for inputIndex === index in the UPDATE array
        //   -because that's the item that already exists in the DB that will
        //    have to be removed
        //   -DELETE is also processed first so we can find the item to remove
        //    before filtering it from UPDATE
        case "remove_column": {
            return {
                ...formData,
                columns: {
                    create: formData.columns.create.filter((column, index) => {
                        return (
                            action.index - formData.columns.update.length !==
                            index
                        )
                    }),
                    delete: [
                        ...formData.columns.delete,
                        ...formData.columns.update.filter((column, index) => {
                            return action.index === index
                        }),
                    ],
                    update: formData.columns.update.filter((column, index) => {
                        return action.index !== index
                    }),
                },
            }
        }
        default: {
            throw Error(`Unknown action: ${JSON.stringify(action)}`)
        }
    }
}

type EditTaskFormData = {
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
}

type EditTaskAction =
    | { type: "change_title"; text: string }
    | { type: "change_description"; text: string }
    | { type: "add_subTask"; text: string }
    | { type: "change_subTask"; index: number; text: string }
    | { type: "remove_subTask"; index: number }
    | { type: "change_status"; id: number }

export function editTaskReducer(
    formData: EditTaskFormData,
    action: EditTaskAction
) {
    switch (action.type) {
        case "change_title": {
            return {
                ...formData,
                title: action.text,
            }
        }
        case "change_description": {
            return {
                ...formData,
                description: action.text,
            }
        }
        case "add_subTask": {
            return {
                ...formData,
                subTasks: {
                    ...formData.subTasks,
                    create: [...formData.subTasks.create, action.text],
                },
            }
        }
        // mapping the CREATE array:
        //   -we look for (inputIndex - UPDATE.length) === index
        //   -because the update array is always rendered before the create array
        // mapping the UPDATE array:
        //   -we look for inputIndex === index
        // and there is never mapping for DELETE
        //   -because it's never rendered
        case "change_subTask": {
            return {
                ...formData,
                subTasks: {
                    create: formData.subTasks.create.map((subTask, index) => {
                        if (
                            action.index - formData.subTasks.update.length ===
                            index
                        ) {
                            return action.text
                        } else {
                            return subTask
                        }
                    }),
                    update: formData.subTasks.update.map((subTask, index) => {
                        if (action.index === index) {
                            return {
                                id: subTask.id,
                                description: action.text,
                            }
                        } else {
                            return subTask
                        }
                    }),
                    delete: [...formData.subTasks.delete],
                },
            }
        }
        // filtering the CREATE array:
        //   -we look for (inputIndex - UPDATE.length) !== index
        //   -because the update array is always rendered before the create array
        // filtering the UPDATE array:
        //   -we look for inputIndex !== index
        // for the DELETE array:
        //   -we look for inputIndex === index in the UPDATE array
        //   -because that's the item that already exists in the DB that will
        //    have to be removed
        //   -DELETE is also processed first so we can find the item to remove
        //    before filtering it from UPDATE
        case "remove_subTask": {
            return {
                ...formData,
                subTasks: {
                    create: formData.subTasks.create.filter(
                        (subTask, index) => {
                            return (
                                action.index -
                                    formData.subTasks.update.length !==
                                index
                            )
                        }
                    ),
                    delete: [
                        ...formData.subTasks.delete,
                        ...formData.subTasks.update.filter((subTask, index) => {
                            return action.index === index
                        }),
                    ],
                    update: formData.subTasks.update.filter(
                        (subTask, index) => {
                            return action.index !== index
                        }
                    ),
                },
            }
        }
        case "change_status": {
            return {
                ...formData,
                columnId: action.id,
            }
        }
        default: {
            throw Error(`Unknown action: ${JSON.stringify(action)}`)
        }
    }
}
