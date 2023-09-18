import { nanoid } from "nanoid"
import StyleToggle from "./StyleToggle"

type Props = {
    numBoards: number
    boardNames: string[]
    selectedBoardIndex: number
    handleShowSideBar: Function
}

export default function SideBar({
    numBoards,
    boardNames,
    selectedBoardIndex,
    handleShowSideBar,
}: Props) {
    const boardsList = boardNames.map((boardName, index) => {
        const isSelected = index === selectedBoardIndex

        const normalStyles = "bg-[url('../public/board-icon.svg')]"
        const selectedStyles =
            "bg-purple-600 text-neutral-300 rounded-r-full block} bg-[url('../public/board-icon-white.svg')]"

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
            onClick={(e) => handleShowSideBar(e)}
            className="bg-neutral-900/70 absolute flex flex-col items-center inset-0 pt-[5rem]"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="bg-neutral-700 py-4 w-3/4 gap-3 rounded-lg shadow-[0_10px_20px_0_rgba(54,78,126,0.25)]"
            >
                <h2 className="uppercase text-neutral-500 text-[0.85rem] font-bold tracking-[0.12em] mb-4 pl-6">{`All Boards (${numBoards})`}</h2>
                <ul className="text-neutral-500 font-bold flex flex-col mb-4">
                    {boardsList}
                    <li className="font-bold py-3 pl-[3.4rem] mr-6 text-purple-600 bg-[url('../public/board-icon-purple.svg')] bg-no-repeat bg-[center_left_1.5rem]">
                        + Create New Board
                    </li>
                </ul>
                <div className="bg-neutral-800 rounded mx-3 flex flex-row justify-center py-4">
                    <StyleToggle isLight={false} />
                </div>
            </div>
        </div>
    )
}
