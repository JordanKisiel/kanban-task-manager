import Image from "next/image"
import ActionButton from "@/components/ui-elements/ActionButton"
import addIconDark from "@/public/plus-icon.svg"
import addIconLight from "@/public/plus-icon-gray.svg"

type Props = {
    setIsModalOpen: Function
    setModalMode: Function
    isDarkMode: boolean
}

export default function NewUserBoardContent({
    setIsModalOpen,
    setModalMode,
    isDarkMode,
}: Props) {
    return (
        <div className="flex flex-col grow items-center min-h-fit justify-center w-full h-full">
            <div className="flex flex-col items-center">
                <p className="text-neutral-500 text-center w-[80%] text-lg font-bold leading-6 mb-6 -mt-12">
                    You don't seem to have any boards. Try creating one!
                </p>
                <ActionButton
                    isWidthFull={false}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => {
                        setIsModalOpen(true)
                        setModalMode("addBoard")
                    }}
                >
                    <Image
                        className="w-[5%] mt-[0.2rem]"
                        src={isDarkMode ? addIconDark : addIconLight}
                        alt="Add icon"
                        width={12}
                        height={12}
                    />
                    <span>Create New Board</span>
                </ActionButton>
            </div>
        </div>
    )
}
