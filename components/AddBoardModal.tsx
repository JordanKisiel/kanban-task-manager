import ActionButton from "./ActionButton"
import ColumnInputList from "./ColumnsInputList"

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function AddBoardModal() {
    return (
        <div className="flex flex-col gap-6">
            <h4 className="font-bold text-neutral-100 text-lg">
                Add New Board
            </h4>
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
            <ColumnInputList />
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
