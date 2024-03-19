type Props = {
    id: number
    placeholderText: string
    value?: string
    handleRemoveInput: Function
    handleChangeInput: Function
}

export default function RemovableInput({
    id,
    placeholderText,
    value,
    handleRemoveInput,
    handleChangeInput,
}: Props) {
    return (
        <div className="flex flex-row">
            <input
                onChange={(e) => handleChangeInput(e, id)}
                type="text"
                id={`${id}`}
                placeholder={placeholderText}
                className="
                    w-full bg-neutral-100 dark:bg-neutral-700 border-[1px] border-neutral-300 
                    dark:border-neutral-600 rounded text-sm text-neutral-900 dark:text-neutral-100 
                    px-4 py-3 focus:outline-none focus:border-purple-600 focus:dark:border-purple-600 
                    placeholder:text-neutral-500"
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
