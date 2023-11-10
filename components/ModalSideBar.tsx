import { nanoid } from "nanoid"
import StyleToggle from "./StyleToggle"
import { useBoards } from "@/lib/dataUtils"

type Props = {
    selectedBoardIndex: number
    handleShowAddBoardModal: Function
    handleShowModalSideBar: Function
    isDarkMode: boolean
    toggleDarkMode: Function
}

export default function ModalSideBar({
    selectedBoardIndex,
    handleShowAddBoardModal,
    handleShowModalSideBar,
    isDarkMode,
    toggleDarkMode,
}: Props) {
    const { boards, isLoading, isError, mutate } = useBoards(
        "be0fc8c3-496f-4ed8-9f27-32dcc66bba24"
    )

    const numBoards = isLoading ? 0 : boards.length

    const boardNames = isLoading ? [] : boards.map((board) => board.title)

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
            onClick={(e) => handleShowModalSideBar(e)}
            className="
                bg-neutral-900/50 dark:bg-neutral-900/70 absolute flex flex-col 
                items-center inset-0 pt-[5rem] md:hidden"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                    bg-neutral-100 dark:bg-neutral-700 py-4 w-3/4 gap-3 rounded-lg 
                    shadow-[0_10px_20px_0_rgba(54,78,126,0.25)]"
            >
                <h2
                    className="
                    uppercase text-neutral-500 text-[0.85rem] font-bold tracking-[0.12em] 
                    mb-4 pl-6"
                >{`All Boards (${numBoards})`}</h2>
                <ul className="text-neutral-500 font-bold flex flex-col mb-4">
                    {boardsList}
                    <li
                        onClick={(e) => {
                            handleShowModalSideBar(e)
                            handleShowAddBoardModal()
                        }}
                        className="
                            font-bold py-3 pl-[3.4rem] mr-6 text-purple-600 
                            bg-[url('../public/board-icon-purple.svg')] bg-no-repeat bg-[center_left_1.5rem]"
                    >
                        + Create New Board
                    </li>
                </ul>
                <div className="bg-neutral-200 dark:bg-neutral-800 rounded mx-3 flex flex-row justify-center py-4">
                    <StyleToggle
                        isLight={!isDarkMode}
                        toggleDarkMode={toggleDarkMode}
                    />
                </div>
            </div>
        </div>
    )
}
