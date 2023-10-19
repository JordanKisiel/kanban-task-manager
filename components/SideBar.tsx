import { nanoid } from "nanoid"
import StyleToggle from "./StyleToggle"
import NoSsr from "./NoSsr"

type Props = {
    numBoards: number
    boardNames: string[]
    selectedBoardIndex: number
    handleShowAddBoardModal: Function
    handleHideSideBar: Function
    handleShowSideBar: Function
    isDarkMode: boolean
    toggleDarkMode: Function
}

export default function SideBar({
    numBoards,
    boardNames,
    selectedBoardIndex,
    handleShowAddBoardModal,
    handleHideSideBar,
    handleShowSideBar,
    isDarkMode,
    toggleDarkMode,
}: Props) {
    const boardsList = boardNames.map((boardName, index) => {
        const isSelected = index === selectedBoardIndex

        const normalStyles = "bg-[url('../public/board-icon.svg')]"
        const selectedStyles =
            "bg-purple-600 text-neutral-300 rounded-r-full block bg-[url('../public/board-icon-white.svg')]"

        return (
            <li
                key={nanoid()}
                className={`py-3 pl-[3.4rem] mr-6 bg-no-repeat bg-[center_left_1.5rem] ${
                    isSelected ? selectedStyles : normalStyles
                }`}
            >
                {boardName}
            </li>
        )
    })

    return (
        <div
            onClick={(e) => e.stopPropagation()}
            className="bg-neutral-100 dark:bg-neutral-700 py-4 gap-3 w-full md:flex md:flex-col md:h-full md:border-r-[1px] md:border-neutral-300 md:dark:border-neutral-600 md:justify-between md:pb-12"
        >
            <div>
                <h2 className="uppercase text-neutral-500 text-[0.85rem] font-bold tracking-[0.12em] mb-4 pl-6">{`All Boards (${numBoards})`}</h2>
                <ul className="text-neutral-500 font-bold flex flex-col mb-4">
                    {boardsList}
                    <li
                        onClick={(e) => {
                            handleShowSideBar(e)
                            handleShowAddBoardModal()
                        }}
                        className="font-bold py-3 pl-[3.4rem] mr-6 text-purple-600 bg-[url('../public/board-icon-purple.svg')] bg-no-repeat bg-[center_left_1.5rem]"
                    >
                        + Create New Board
                    </li>
                </ul>
            </div>
            <div className="flex flex-col gap-5 items-start w-full px-5">
                <div className="bg-neutral-200 dark:bg-neutral-800 rounded flex flex-row justify-center py-3 w-full">
                    <NoSsr>
                        <StyleToggle
                            isLight={!isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                        />
                    </NoSsr>
                </div>
                <button
                    onClick={() => handleHideSideBar()}
                    className="bg-[url('../public/hide-icon.svg')] bg-no-repeat bg-[center_left] text-neutral-500 font-bold pl-8"
                >
                    Hide Sidebar
                </button>
            </div>
        </div>
    )
}
