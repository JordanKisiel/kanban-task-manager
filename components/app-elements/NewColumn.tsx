import Image from "next/image"
import addIconDark from "@/public/plus-icon.svg"
import addIconLight from "@/public/plus-icon-gray.svg"

type Props = {
    setIsModalOpen: Function
    setModalMode: Function
    isDarkMode: boolean
}

export default function NewColumn({
    setIsModalOpen,
    setModalMode,
    isDarkMode,
}: Props) {
    return (
        <div className="flex flex-col pt-[2.3rem] h-full justify-center">
            <button
                onClick={() => {
                    setIsModalOpen(true)
                    setModalMode("editBoard")
                }}
                className="
                        flex flex-row text-neutral-500 dark:text-neutral-400 bg-neutral-300/50 
                        dark:bg-neutral-700/20 text-2xl font-bold items-center gap-2 w-full h-full 
                        justify-center rounded"
            >
                <Image
                    className="mt-[0.5rem] opacity-50"
                    src={isDarkMode ? addIconDark : addIconLight}
                    alt="Add icon"
                    width={12}
                    height={12}
                />
                New Column
            </button>
        </div>
    )
}
