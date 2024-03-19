import ModalLabel from "@/components/modals/ModalLabel"

type Props = {
    handleTitleChange: Function
    titlePlaceholder: string
    titleValue: string
    labelText: string
}

export default function TitleInput({
    handleTitleChange,
    titlePlaceholder,
    titleValue,
    labelText,
}: Props) {
    return (
        <>
            <ModalLabel htmlFor="title-input">{labelText}</ModalLabel>
            <input
                onChange={(e) => handleTitleChange(e)}
                type="text"
                id="title-input"
                className="
                        w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 
                        rounded text-sm dark:text-neutral-100 px-4 py-3 focus:outline-none 
                        focus:border-purple-600 focus:dark:border-purple-600 
                        placeholder-dark:text-neutral-500 placeholder-dark:opacity-50"
                placeholder={titlePlaceholder}
                value={titleValue}
            />
        </>
    )
}
