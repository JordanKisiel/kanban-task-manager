import ModalLabel from "@/components/modals/ModalLabel"

type Props = {
    handleDescriptionChange: Function
    descriptionPlaceholder: string
    descriptionValue: string
    descriptionContent: string
    labelText: string
}

export default function DescriptionInput({
    handleDescriptionChange,
    descriptionPlaceholder,
    descriptionValue,
    descriptionContent,
    labelText,
}: Props) {
    return (
        <>
            <ModalLabel htmlFor="description-input">{labelText}</ModalLabel>
            <textarea
                onChange={(e) => handleDescriptionChange(e)}
                id="description-input"
                className="
                            w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 
                            rounded text-sm dark:text-neutral-100 px-4 py-3 focus:outline-none 
                            focus:border-purple-600 focus:dark:border-purple-600 
                            placeholder-dark:text-neutral-500 placeholder-dark:opacity-50"
                rows={4}
                placeholder={descriptionPlaceholder}
                value={descriptionValue}
            >
                {descriptionContent}
            </textarea>
        </>
    )
}
