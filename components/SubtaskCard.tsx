import { Subtask } from "../types"

type Props = {
    subtask: Subtask
}

export default function SubtaskCard({ subtask }: Props) {
    return (
        <div className="rounded bg-neutral-800 flex flex-row px-3 py-4 gap-3">
            <input
                className="appearance-none bg-neutral-100 text-neutral-500 w-[1rem] aspect-square rounded-sm checked:bg-purple-600 checked:bg-[url('../public/check-icon.svg')] checked:bg-no-repeat checked:bg-center"
                type="checkbox"
                checked={subtask.isComplete}
            />
            <p
                className={`text-xs ${subtask.isComplete && "line-through"} ${
                    subtask.isComplete ? "text-neutral-500" : "text-neutral-100"
                }`}
            >
                {subtask.description}
            </p>
        </div>
    )
}
