import ActionButton from "./ActionButton"
import ColumnInputList from "./ColumnsInputList"
import { Board } from "@/types"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import ModalLabel from "./ModalLabel"

type Props = {
    board: Board
    handleBackToBoard: Function
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function EditBoardModal({ board, handleBackToBoard }: Props) {
    const menuOptions = [
        {
            actionName: "Close",
            action: () => handleBackToBoard(),
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between">
                <ModalHeader>Edit Board</ModalHeader>
                <MenuButton actions={menuOptions} />
            </div>
            <div>
                <ModalLabel htmlFor="title-input">Board Name</ModalLabel>
                <input
                    type="text"
                    id="title-input"
                    className="w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 rounded text-sm dark:text-neutral-100 px-4 py-3 outline-2 dark:outline-purple-300 placeholder-dark:text-neutral-500 placeholder-dark:opacity-50"
                    placeholder={TITLE_PLACEHOLDER}
                    value={board.title}
                />
            </div>
            <ColumnInputList existingColumns={board.columns} />
            <div>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    handler={() => {
                        /* does nothing */
                    }}
                >
                    Save Board Changes
                </ActionButton>
            </div>
        </div>
    )
}
