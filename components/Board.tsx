import Image from "next/image"
import ActionButton from "./ActionButton"
import addIcon from "../public/plus-icon.svg"

export default function Board() {
    return (
        <div className="flex flex-col grow items-center min-h-fit justify-center">
            <p className="text-neutral-500 text-center w-[80%] text-lg font-bold leading-6 mb-6 -mt-12">
                This board is empty. Create a new column to get started.
            </p>
            <ActionButton>
                <Image
                    className="w-[5%] mt-[0.2rem]"
                    src={addIcon}
                    alt="Add icon"
                />
                <span>Add New Column</span>
            </ActionButton>
        </div>
    )
}
