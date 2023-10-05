import ActionButton from "./ActionButton"
import SubtaskInputList from "./SubtaskInputList"
import MenuButton from "./MenuButton"

type Props = {
    columnNames: string[]
    handleBackToBoard: Function
}

const TITLE_PLACEHOLDER = "e.g. Take coffee break"
const DESCRIPTION_PLACEHOLDER =
    "e.g. It's always good to take a break. This 15 minute break will charge the batteries a little."

export default function AddTaskModal({
    columnNames,
    handleBackToBoard,
}: Props) {
    const selectOptions = columnNames.map((columnName) => {
        return (
            <option
                key={columnName}
                value={columnName}
            >
                {columnName}
            </option>
        )
    })

    const menuOptions = [
        {
            actionName: "Close",
            action: () => handleBackToBoard(),
        },
    ]

    return (
        <>
            <div className="flex flex-row justify-between">
                <h4 className="text-neutral-100 text-lg leading-6 mb-6">
                    Add New Task
                </h4>
                <MenuButton actions={menuOptions} />
            </div>
            <form className="flex flex-col gap-6">
                <div>
                    <label
                        htmlFor="title-input"
                        className="text-neutral-100 text-xs block mb-2"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title-input"
                        className="w-full bg-neutral-700 border-[1px] border-neutral-600 rounded text-sm text-neutral-100 px-4 py-3 outline-2 outline-purple-300 placeholder:text-neutral-500 placeholder:opacity-50"
                        placeholder={TITLE_PLACEHOLDER}
                    />
                </div>
                <div>
                    <label
                        htmlFor="description-input"
                        className="text-neutral-100 text-xs block mb-2"
                    >
                        Description
                    </label>
                    <textarea
                        id="description-input"
                        className="w-full bg-neutral-700 border-[1px] border-neutral-600 rounded text-sm text-neutral-100 px-4 py-3 outline-2 outline-purple-300 placeholder:text-neutral-500 placeholder:opacity-50"
                        rows={4}
                        placeholder={DESCRIPTION_PLACEHOLDER}
                    ></textarea>
                </div>
                <SubtaskInputList />
                <div>
                    <label
                        htmlFor="status-select"
                        className="text-neutral-100 text-xs block mb-2"
                    >
                        Status
                    </label>
                    <select
                        className="appearance-none w-full bg-neutral-700 border-[1px] border-neutral-600 rounded text-sm text-neutral-100 px-4 py-3 outline-2 outline-purple-300 bg-[url('../public/arrow-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                        name="status"
                        id="status-select"
                    >
                        {selectOptions}
                    </select>
                </div>
                <ActionButton
                    isWidthFull={true}
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    handler={() => {
                        /*does nothing*/
                    }}
                >
                    Create Task
                </ActionButton>
            </form>
        </>
    )
}
