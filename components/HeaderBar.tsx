import Image from "next/image"
import ActionButton from "./ActionButton"
import MenuButton from "./MenuButton"
import addIcon from "../public/plus-icon.svg"

type Props = {
    selectedBoard: string
    isSideBarShown: boolean
    setIsModalOpen: Function
    handleShowAddTaskModal: Function
    handleShowModalSideBar: Function
    handleSwitchModalMode: Function
}

export default function HeaderBar({
    selectedBoard,
    isSideBarShown,
    setIsModalOpen,
    handleShowAddTaskModal,
    handleShowModalSideBar,
    handleSwitchModalMode,
}: Props) {
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
        <section className="bg-neutral-700 flex flex-row p-4 justify-between items-center w-full">
            <div className="relative pr-4">
                <h1 className="text-neutral-100 text-lg font-bold">
                    {selectedBoard}
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
                    textColor="text-neutral-100"
                    textSize="text-base"
                    handler={() => handleShowAddTaskModal()}
                >
                    <Image
                        className="md:w-[0.65rem] md:mt-[0.2rem]"
                        src={addIcon}
                        alt="add icon"
                    />
                    <span className="hidden md:inline-block">Add New Task</span>
                </ActionButton>
                <MenuButton actions={menuOptions} />
            </div>
        </section>
    )
}
