//code from:
//https://stackoverflow.com/a/65821541

import { useEffect } from "react"

export function useOutsideClick(ref: any, onClickOutside: () => void) {
    useEffect(() => {
        const onClick = ({ target }: any) => {
            !ref?.contains(target) && onClickOutside()
        }

        document.addEventListener("click", onClick)

        return () => document.removeEventListener("click", onClick)
    }, [ref])
}
