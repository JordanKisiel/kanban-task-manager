"use client"

import StyleToggle from "@/components/ui-elements/StyleToggle"
import Modal from "@/components/modals/Modal"
import { useModal } from "@/hooks/useModal"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"
import { Board } from "@/types"
import AddBoardModal from "@/components/modals/AddBoardModal"
import { truncate } from "@/lib/utils"
import { useDarkMode } from "@/contexts/DarkModeProvider"
import BoardsList from "@/components/app-elements/BoardsList"
import {
    BUTTON_TEXT_NEW_BOARD,
    BUTTON_TEXT_HIDE_SIDEBAR,
    MAX_SIDEBAR_BOARD_TITLE_LENGTH,
    NUM_TRUNCATION_ELLIPSIS,
} from "@/lib/config"

type Props = {
    handleHideSideBar: Function
    handleShowSideBar: Function
    selectedBoardIndex: number
    boards: Board[]
    isPending: boolean
}

export default function SideBar({
    handleHideSideBar,
    handleShowSideBar,
    selectedBoardIndex,
    boards,
    isPending,
}: Props) {
    const { setNewBoardCreated } = useNewBoardCreated(isPending, boards)

    const [isModalOpen, setIsModalOpen, modalMode, setModalMode] = useModal(
        "addBoard",
        false
    )

    const { isDarkMode, toggleDarkMode } = useDarkMode()

    const numBoards = isPending ? 0 : boards.length

    const boardTitles = isPending
        ? []
        : boards &&
          boards.map((board) => {
              return {
                  id: board.id,
                  title: truncate(
                      board.title,
                      MAX_SIDEBAR_BOARD_TITLE_LENGTH,
                      NUM_TRUNCATION_ELLIPSIS
                  ),
              }
          })

    return (
        <>
            <div
                onClick={(e) => e.stopPropagation()}
                className="
                bg-neutral-100 dark:bg-neutral-700 py-4 gap-3 w-full 
                md:flex md:flex-col md:h-full md:border-r-[1px] md:border-neutral-300 
                md:dark:border-neutral-600 md:justify-between md:pb-12"
            >
                <div>
                    <h2 className="uppercase text-neutral-500 text-[0.85rem] font-bold tracking-[0.12em] mb-4 pl-6">
                        {`All Boards (${numBoards})`}
                    </h2>
                    <ul className="text-neutral-500 font-bold flex flex-col mb-4 gap-1">
                        <div className="flex flex-col gap-1 overflow-y-auto max-h-[30rem]">
                            <BoardsList
                                boardTitles={boardTitles}
                                isPending={isPending}
                                selectedBoardIndex={selectedBoardIndex}
                            />
                        </div>
                        <button
                            onClick={(e) => {
                                handleShowSideBar(e)
                                setIsModalOpen(true)
                                setModalMode("addBoard")
                            }}
                            className="
                            font-bold py-2 pl-[3rem] text-purple-600 
                            bg-[url('../public/board-icon-purple.svg')] bg-no-repeat bg-[center_left_1.4rem] text-left"
                        >
                            {BUTTON_TEXT_NEW_BOARD}
                        </button>
                    </ul>
                </div>
                <div className="flex flex-col gap-5 items-start w-full px-5">
                    <div
                        className="
                    bg-neutral-200 dark:bg-neutral-800 rounded flex flex-row justify-center py-3 w-full"
                    >
                        <StyleToggle
                            isLight={!isDarkMode}
                            toggleDarkMode={toggleDarkMode}
                        />
                    </div>
                    <button
                        onClick={() => handleHideSideBar()}
                        className="
                        bg-[url('../public/hide-icon.svg')] bg-no-repeat bg-[center_left] 
                        text-neutral-500 font-bold pl-8"
                    >
                        {BUTTON_TEXT_HIDE_SIDEBAR}
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    selectedBoardIndex={selectedBoardIndex}
                    setIsModalOpen={setIsModalOpen}
                >
                    <AddBoardModal
                        selectedBoardIndex={selectedBoardIndex}
                        setIsModalOpen={setIsModalOpen}
                        setNewBoardCreated={setNewBoardCreated}
                    />
                </Modal>
            )}
        </>
    )
}
