import ActionButton from "./ActionButton"
import ColumnInputList from "./ColumnsInputList"
import MenuButton from "./MenuButton"

type Props = {
    handleBackToBoard: Function
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function AddBoardModal({ handleBackToBoard }: Props) {
    const menuOptions = [
        {
            actionName: "Close",
            action: () => {
                handleBackToBoard()
            },
        },
    ]

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-row justify-between">
                <h4 className="font-bold text-neutral-100 text-lg">
                    Add New Board
                </h4>
                <MenuButton actions={menuOptions} />
            </div>
            <div>
                <label
                    htmlFor="title-input"
                    className="text-neutral-100 text-xs block mb-2"
                >
                    Board Name
                </label>
                <input
                    type="text"
                    id="title-input"
                    className="w-full bg-neutral-700 border-[1px] border-neutral-600 rounded text-sm text-neutral-100 px-4 py-3 outline-2 outline-purple-300 placeholder:text-neutral-500 placeholder:opacity-50"
                    placeholder={TITLE_PLACEHOLDER}
                />
            </div>
            <ColumnInputList existingColumns={[]} />
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
                    Create New Board
                </ActionButton>
            </div>
        </div>
    )
}
