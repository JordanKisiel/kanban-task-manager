"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"
import Link from "next/link"
import StyleToggle from "./StyleToggle"
import Modal from "./Modal"
import ModalContent from "./ModalContent"
import ItemSkeleton from "./ItemSkeleton"
import { allBoardsOptions } from "@/lib/queries"
import { useModal } from "@/hooks/useModal"
import { testUserId } from "@/testing/testingConsts"
import { useNewBoardCreated } from "@/hooks/useNewBoardCreated"

type Props = {
    handleHideSideBar: Function
    handleShowSideBar: Function
    isDarkMode: boolean
    toggleDarkMode: Function
    selectedBoardIndex: number
    taskId: number | null
    changeSelectedBoardIndex: Function
}

export default function SideBar({
    handleHideSideBar,
    handleShowSideBar,
    isDarkMode,
    toggleDarkMode,
    selectedBoardIndex,
    taskId,
    changeSelectedBoardIndex,
}: Props) {
    const {
        data: boards,
        isError,
        isPending,
    } = useQuery(allBoardsOptions(testUserId))

    const { setNewBoardCreated } = useNewBoardCreated(isPending, boards)

    const [isModalOpen, setIsModalOpen, modalMode, setModalMode] = useModal(
        "addBoard",
        false
    )

    const NUM_SKELETON_ITEMS = 3

    const numBoards = isPending ? 0 : boards?.length

    const boardsList = isPending
        ? Array(NUM_SKELETON_ITEMS)
              .fill("")
              .map((item, index) => {
                  return (
                      <ItemSkeleton
                          key={index}
                          width="full"
                          height="large"
                          bgColor="bg-neutral-400 dark:bg-neutral-800"
                          opacity={"opacity-100"}
                          margins={"ml-[1.4rem] mr-8 mb-3"}
                      />
                  )
              })
        : boards &&
          boards.map((board, index) => {
              const isSelected = index === selectedBoardIndex

              const normalStyles = "bg-[url('../public/board-icon.svg')]"
              const selectedStyles =
                  "bg-purple-600 text-neutral-300 rounded-r-full block bg-[url('../public/board-icon-white.svg')]"

              return (
                  <Link
                      href={`?board=${index}`}
                      key={board.id}
                  >
                      <li
                          className={`py-3 pl-[3.4rem] mr-6 bg-no-repeat bg-[center_left_1.5rem] ${
                              isSelected ? selectedStyles : normalStyles
                          }`}
                      >
                          {board.title}
                      </li>
                  </Link>
              )
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
                        {boardsList}
                        <button
                            onClick={(e) => {
                                handleShowSideBar(e)
                                setIsModalOpen(true)
                                setModalMode("addBoard")
                            }}
                            className="
                            font-bold py-4 pl-[3rem] text-purple-600 
                            bg-[url('../public/board-icon-purple.svg')] bg-no-repeat bg-[center_left_1.4rem] text-left"
                        >
                            + Create New Board
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
                        Hide Sidebar
                    </button>
                </div>
            </div>
            {isModalOpen && (
                <Modal
                    selectedBoardIndex={selectedBoardIndex}
                    setIsModalOpen={setIsModalOpen}
                >
                    <ModalContent
                        mode={modalMode}
                        selectedBoardIndex={selectedBoardIndex}
                        taskId={taskId}
                        setModalMode={setModalMode}
                        setIsModalOpen={setIsModalOpen}
                        setNewBoardCreated={setNewBoardCreated}
                        changeSelectedBoardIndex={changeSelectedBoardIndex}
                    />
                </Modal>
            )}
        </>
    )
}
