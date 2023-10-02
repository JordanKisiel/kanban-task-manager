import ActionButton from "./ActionButton"

type Props = {
    taskTitle: string
}

export default function DeleteTaskModal({ taskTitle }: Props) {
    return (
        <div className="flex flex-col gap-6 bg-neutral-700">
            <h4 className="font-bold text-red-300 text-lg">
                Delete this task?
            </h4>
            <p className="text-sm text-neutral-500 leading-6">{`Are you sure you want to delete the '${taskTitle}' task and its subtasks? This action cannot be reversed.`}</p>
            <div className="flex flex-col gap-4">
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-red-300"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    handler={() => {
                        /* does nothing */
                    }}
                >
                    Delete
                </ActionButton>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-neutral-100"
                    textColor="text-purple-600"
                    textSize="text-sm"
                    handler={() => {
                        /* does nothing */
                    }}
                >
                    Cancel
                </ActionButton>
            </div>
        </div>
    )
}
