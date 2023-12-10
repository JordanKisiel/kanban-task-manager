"use client"

import { useState, useRef } from "react"
import { useOutsideClick } from "@/hooks/useOutsideClick"

type Props = {
    actions: {
        actionName: string
        action: Function
        isDisabled: boolean
    }[]
}

export default function MenuButton({ actions }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef: any = useRef()

    const taskMenu = actions.map((action) => {
        return (
            <button
                type="button"
                key={action.actionName}
                disabled={action.isDisabled}
                onClick={() => action.action()}
                className={`
                    bg-neutral-300 dark:bg-neutral-600 w-full px-6 py-3 rounded ${
                        action.isDisabled
                            ? "text-neutral-400 dark:text-neutral-500"
                            : "text-neutral-900 dark:text-neutral-100"
                    } 
                    text-xs text-[0.82rem] uppercase tracking-[0.12em] whitespace-nowrap`}
            >
                {action.actionName}
            </button>
        )
    })

    useOutsideClick(menuRef.current, handleCloseMenu)

    function handleOpenMenu() {
        setIsMenuOpen(true)
    }

    function handleCloseMenu() {
        setIsMenuOpen(false)
    }

    return (
        <div
            ref={menuRef}
            className="relative"
        >
            <button
                type="button"
                onClick={() => {
                    if (isMenuOpen) {
                        handleCloseMenu()
                    } else {
                        handleOpenMenu()
                    }
                }}
                className="text-xs leading-6 text-transparent bg-[url('../public/menu-icon.svg')] bg-no-repeat bg-right"
            >
                Menu
            </button>
            <div
                className={`
                    absolute bg-neutral-100 dark:bg-neutral-700 flex flex-col items-end 
                    ${
                        isMenuOpen && "p-3"
                    } gap-4 top-[2.5rem] right-[-0.5rem] rounded 
                    shadow-[0_5px_10px_0_rgba(4,8,20,0.25)]  dark:shadow-[0_5px_10px_0_rgba(4,8,20,0.75)]`}
            >
                {isMenuOpen && taskMenu}
            </div>
        </div>
    )
}
