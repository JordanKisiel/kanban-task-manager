import Image from "next/image"
import ActionButton from "./ActionButton"
import MenuButton from "./MenuButton"
import addIcon from "../public/plus-icon.svg"
import { useBoards } from "@/lib/dataUtils"

type Props = {
    selectedBoardIndex: number
    isSideBarShown: boolean
    setIsModalOpen: Function
    handleShowAddTaskModal: Function
    handleShowModalSideBar: Function
    handleSwitchModalMode: Function
}

export default function HeaderBar({
    selectedBoardIndex,
    isSideBarShown,
    setIsModalOpen,
    handleShowAddTaskModal,
    handleShowModalSideBar,
    handleSwitchModalMode,
}: Props) {
    const { boards, isLoading, isError, mutate } = useBoards(
        "be0fc8c3-496f-4ed8-9f27-32dcc66bba24"
    )

    const selectedBoardTitle = isLoading
        ? "Loading title"
        : boards[selectedBoardIndex].title

    const isNoBoards = boards.length === 0
    const isNoColumns =
        isNoBoards || boards[selectedBoardIndex].columns.length === 0

    const menuOptions = [
        {
            actionName: "Edit Board",
            action: () => {
                setIsModalOpen(true)
                handleSwitchModalMode("editBoard")
            },
        },
        {
            actionName: "Delete Board",
            action: () => {
                setIsModalOpen(true)
                handleSwitchModalMode("deleteBoard")
            },
        },
    ]

    return (
        <section className="bg-neutral-100 dark:bg-neutral-700 flex flex-row p-4 justify-between items-center w-full">
            <div className="relative pr-4">
                <h1 className="text-neutral-900 dark:text-neutral-100 text-lg font-bold">
                    {selectedBoardTitle}
                </h1>
                <button
                    onClick={(e) => handleShowModalSideBar(e)}
                    className={`absolute w-full h-full top-0 bg-no-repeat bg-right ${
                        isSideBarShown
                            ? "bg-[url('../public/arrow-up.svg')]"
                            : "bg-[url('../public/arrow-down.svg')]"
                    } md:hidden md:bg-none`}
                ></button>
            </div>
            <div className="flex items-center">
                <ActionButton
                    isWidthFull={false}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100 dark:text-neutral-100"
                    textSize="text-base"
                    isDisabled={isNoBoards || isNoColumns}
                    handler={() => handleShowAddTaskModal()}
                >
                    <Image
                        className="md:w-[0.65rem] md:mt-[0.2rem]"
                        src={addIcon}
                        alt="add icon"
                        width={12}
                        height={12}
                    />
                    <span className="hidden md:inline-block">Add New Task</span>
                </ActionButton>
                <MenuButton actions={menuOptions} />
            </div>
        </section>
    )
}
