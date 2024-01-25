"use client"

import { createContext, useContext } from "react"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { useEffect } from "react"

const DARK_MODE_KEY = "kanban-isDarkMode"

export const DarkModeContext = createContext<boolean>(true)
export const DarkModeToggleContext = createContext<Function>(() => {})

type Props = {
    children: React.ReactNode
}

export function DarkModeProvider({ children }: Props) {
    const [isDarkMode, setIsDarkMode] = useLocalStorage(
        DARK_MODE_KEY,
        true
    ) as [boolean, Function]

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

    return (
        <DarkModeContext.Provider value={isDarkMode}>
            <DarkModeToggleContext.Provider value={toggleDarkMode}>
                {children}
            </DarkModeToggleContext.Provider>
        </DarkModeContext.Provider>
    )
}

export function useDarkMode() {
    return {
        isDarkMode: useContext(DarkModeContext),
        toggleDarkMode: useContext(DarkModeToggleContext),
    }
}
