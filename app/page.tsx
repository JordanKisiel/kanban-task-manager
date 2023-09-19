"use client"

import { useState } from "react"
import HeaderBar from "../components/HeaderBar"
import Board from "../components/Board"
import SideBar from "../components/SideBar"

export default function Home() {
    const [showSideBar, setShowSideBar] = useState(false)

    //TODO: replace with real boards data
    const userBoards = ["Platform Launch", "Marketing Plan", "Roadmap"]

    function handleShowSideBar(event: PointerEvent) {
        setShowSideBar((prevValue) => !prevValue)
    }

    return (
        <main className="flex flex-col min-h-screen">
            <HeaderBar
                selectedBoard="Platform Launch"
                isSideBarShown={showSideBar}
                handleShowSideBar={handleShowSideBar}
            />
            <Board />
            {showSideBar && (
                <SideBar
                    numBoards={3}
                    boardNames={userBoards}
                    selectedBoardIndex={0}
                    handleShowSideBar={handleShowSideBar}
                />
            )}
        </main>
    )
}
