import { useLocalStorage } from "./useLocalStorage"
import { useEffect } from "react"

export function useDarkMode(key: string): [boolean, Function] {
    const [isDarkMode, setIsDarkMode] = useLocalStorage(key, true) as [
        boolean,
        Function,
    ]

    useEffect(() => {
        if (isDarkMode) {
            document.querySelector("html")?.classList.add("dark")
        } else {
            document.querySelector("html")?.classList.remove("dark")
        }
    }, [isDarkMode])

    function toggleDarkMode() {
        setIsDarkMode(!isDarkMode)
    }

    return [isDarkMode, toggleDarkMode]
}
