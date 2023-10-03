"use client"

import { useState, useRef } from "react"
import { useOutsideClick } from "@/hooks/useOutsideClick"

type Props = {
    actions: {
        actionName: string
        action: Function
    }[]
}

export default function MenuButton({ actions }: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef: any = useRef()

    const taskMenu = actions.map((action) => {
        return (
            <div className="absolute bg-neutral-700 flex flex-col items-end px-3 py-4 gap-4 top-0 right-0 rounded shadow-[0_5px_10px_0_rgba(4,8,20,0.75)]">
                <button
                    onClick={() => action.action}
                    className="bg-neutral-600 w-full px-6 py-3 rounded text-neutral-100 text-xs text-[0.82rem] uppercase tracking-[0.12em] whitespace-nowrap"
                >
                    {action.actionName}
                </button>
            </div>
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
            onClick={() => {
                handleOpenMenu()
            }}
            className="relative"
        >
            <button className="text-transparent bg-[url('../public/menu-icon.svg')] bg-no-repeat bg-right">
                Task Menu
            </button>
            {isMenuOpen && taskMenu}
        </div>
    )
}
