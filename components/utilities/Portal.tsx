import { createPortal } from "react-dom"

type Props = {
    children: React.ReactNode
}

export default function Portal({ children }: Props) {
    if (typeof window === "object") {
        return createPortal(children, document.body)
    }

    return null
}
