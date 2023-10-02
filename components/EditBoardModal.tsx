import ActionButton from "./ActionButton"
import ColumnInputList from "./ColumnsInputList"
import { Board } from "@/types"

type Props = {
    board: Board
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function EditBoardModal({ board }: Props) {
    return (
        <div className="flex flex-col gap-6">
            <h4 className="font-bold text-neutral-100 text-lg">Edit Board</h4>
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
