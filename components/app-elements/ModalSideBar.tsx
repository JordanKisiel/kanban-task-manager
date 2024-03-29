"use client"

import StyleToggle from "@/components/ui-elements/StyleToggle"
import Modal from "@/components/modals/Modal"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"
import { useModal } from "@/hooks/useModal"
import { Board } from "@/types"
import AddBoardModal from "@/components/modals/AddBoardModal"
import { useDarkMode } from "@/contexts/DarkModeProvider"
import BoardsList from "@/components/app-elements/BoardsList"
import { truncate } from "@/lib/utils"
import {
    BUTTON_TEXT_NEW_BOARD,
    MAX_SIDEBAR_BOARD_TITLE_LENGTH,
    NUM_TRUNCATION_ELLIPSIS,
} from "@/lib/config"

type Props = {
    selectedBoardIndex: number
    boards: Board[]
    isPending: boolean
    setShowModalSideBar: Function
}

export default function ModalSideBar({
    selectedBoardIndex,
    boards,
    isPending,
    setShowModalSideBar,
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
                onClick={(e) => setShowModalSideBar(false)}
                className="
                bg-neutral-900/50 dark:bg-neutral-900/70 fixed flex flex-col 
                items-center inset-0 pt-[5rem] z-10 md:hidden"
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
                        <div className="flex flex-col gap-1 overflow-y-auto max-h-[18rem]">
                            <BoardsList
                                boardTitles={boardTitles}
                                isPending={isPending}
                                selectedBoardIndex={selectedBoardIndex}
                            />
                        </div>
                        <li
                            onClick={(e) => {
                                setIsModalOpen(true)
                                setModalMode("addBoard")
                                setShowModalSideBar(false)
                            }}
                            className="
                            font-bold py-3 pl-[3.2rem] mr-6 text-purple-600 
                            bg-[url('../public/board-icon-purple.svg')] bg-no-repeat bg-[center_left_1.5rem]"
                        >
                            {BUTTON_TEXT_NEW_BOARD}
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
