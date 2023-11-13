import { ModalMode } from "@/types"
import { useState, useEffect } from "react"

export function useModal(
    initialMode: ModalMode,
    initialOpenState: boolean
): [boolean, Function, ModalMode, Function] {
    const [isModalOpen, setIsModalOpen] = useState(initialOpenState)
    const [modalMode, setModalMode] = useState<ModalMode>(initialMode)

    //stop scrolling when modal is open
    useEffect(() => {
        if (isModalOpen) {
            document.querySelector("body")?.classList.add("overflow-y-hidden")
            document.querySelector("body")?.classList.remove("overflow-scroll")
        } else {
            document.querySelector("body")?.classList.add("overflow-scroll")
            document
                .querySelector("body")
                ?.classList.remove("overflow-y-hidden")
        }
    }, [isModalOpen])

    return [isModalOpen, setIsModalOpen, modalMode, setModalMode]
}
