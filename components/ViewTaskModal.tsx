"use client"

import { useState, useRef } from "react"
import { useOutsideClick } from "@/hooks/useOutsideClick"
import { Task } from "../types"
import SubtaskCard from "./SubtaskCard"

type Props = {
    task: Task
    otherColumns: string[]
    currentColumn: string
    handleBackToBoard: Function
}

export default function ViewTaskModal({
    task,
    otherColumns,
    currentColumn,
    handleBackToBoard,
}: Props) {
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef: any = useRef()

    const numCompletedTasks = task.subtasks.reduce((accum, curr) => {
        const valueToAdd = curr.isComplete ? 1 : 0
        return accum + valueToAdd
    }, 0)

    const subtaskCards = task.subtasks.map((subtask) => {
        return (
            <SubtaskCard
                key={subtask.description}
                subtask={subtask}
            />
        )
    })

    const otherColumnOptions = otherColumns.map((column) => {
        return (
            <option
                key={column}
                value={column}
            >
                {column}
            </option>
        )
    })

    const currentColumnOption = (
        <option
            key={currentColumn}
            value={currentColumn}
        >
            {currentColumn}
        </option>
    )

    const columnOptions = [currentColumnOption, ...otherColumnOptions]

    const taskMenu = (
        <div className="absolute bg-neutral-700 flex flex-col items-end px-3 py-4 gap-4 top-0 right-0 rounded shadow-[0_5px_10px_0_rgba(4,8,20,0.75)]">
            <button className="bg-neutral-600 w-full px-6 py-3 rounded text-neutral-100 text-xs text-[0.82rem] uppercase tracking-[0.12em] whitespace-nowrap">
                Edit
            </button>
            <button className="bg-neutral-600 w-full px-6 py-3 rounded text-neutral-100 text-xs text-[0.82rem] uppercase tracking-[0.12em] whitespace-nowrap">
                Delete
            </button>
            <button
                onClick={() => handleBackToBoard()}
                className="bg-neutral-600 w-full px-6 py-3 rounded text-neutral-100 text-xs text-[0.82rem] uppercase tracking-[0.12em] whitespace-nowrap"
            >
                Close Task
            </button>
        </div>
    )

    useOutsideClick(menuRef.current, handleCloseMenu)

    function handleOpenMenu() {
        setIsMenuOpen(true)
    }

    function handleCloseMenu() {
        setIsMenuOpen(false)
    }

    return (
        <>
            <div className="flex flex-row mb-6 justify-between">
                <h4 className="text-neutral-100 text-lg leading-6">
                    {task.title}
                </h4>
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
            </div>
            <p className="text-neutral-500 text-sm leading-6 mb-6">
                {task.description}
            </p>
            <div className="mb-5">
                <span className="text-neutral-100 text-xs block mb-4">{`Subtasks (${numCompletedTasks} of ${task.subtasks.length})`}</span>
                <ul className="flex flex-col gap-2">{subtaskCards}</ul>
            </div>
            <div>
                <span className="text-neutral-100 text-xs block mb-2">
                    Current Status
                </span>
                <select
                    className="appearance-none w-full bg-neutral-700 border-[1px] border-neutral-600 rounded text-sm text-neutral-100 px-4 py-3 outline-2 outline-purple-300 bg-[url('../public/arrow-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                    name="status"
                    id="status-select"
                >
                    {columnOptions}
                </select>
            </div>
        </>
    )
}
