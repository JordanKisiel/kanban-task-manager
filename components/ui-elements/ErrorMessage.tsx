import { useState } from "react"
import Image from "next/image"
import closeIcon from "@/public/close-icon.svg"

type Props = {
    message: string
    close: Function
}

export default function ErrorMessage({ message, close }: Props) {
    function handleClose() {
        close()
    }

    return (
        <div className="bg-red-100 w-full flex flex-row justify-between items-center rounded px-5 py-3">
            <p className="w-[80%]">{message}</p>
            <button
                className="flex flex-row justify-center items-center p-3"
                onClick={() => handleClose()}
            >
                <Image
                    src={closeIcon}
                    alt="close icon"
                />
            </button>
        </div>
    )
}
