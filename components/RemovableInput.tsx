type Props = {
    id: number
    placeholderText: string
    value?: string
    handleRemoveInput: Function
}

export default function RemovableInput({
    id,
    placeholderText,
    value,
    handleRemoveInput,
}: Props) {
    return (
        <div className="flex flex-row">
            <input
                type="text"
                placeholder={placeholderText}
                className="
                    w-full bg-neutral-100 dark:bg-neutral-700 border-[1px] border-neutral-300 
                    dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100 
                    px-4 py-3 outline-2 outline-purple-300 placeholder:text-neutral-500"
                value={value ? value : ""}
            />
            <button
                onClick={(e) => {
                    handleRemoveInput(id)
                    e.preventDefault()
                }}
                className="text-transparent text-[0.1rem] bg-[url('../public/close-icon.svg')] bg-no-repeat bg-right"
            >
                Remove Input
            </button>
        </div>
    )
}
