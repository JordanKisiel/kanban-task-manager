import ActionButton from "./ActionButton"
import SubtaskInputList from "./SubtaskInputList"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"

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
    const isNoColumns = columnNames.length === 0

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

    //  -add the ability to create a task in a board
    //     -I think I need to provide database id of the currently selected board (NOT the selection index)
    //         -I think this exists as a property on the boards state
    // -no indication that data is being submitted to the user
    //      -I need a loading state (maybe I should try using SWR? probably would have to research and learn to a certain extent)

    return (
        <>
            <div className="flex flex-row justify-between">
                <ModalHeader>Add New Task</ModalHeader>
                <MenuButton actions={menuOptions} />
            </div>
            <form className="flex flex-col gap-6">
                <div>
                    <label
                        htmlFor="title-input"
                        className="dark:text-neutral-100 text-xs block mb-2"
                    >
                        Title
                    </label>
                    <input
                        type="text"
                        id="title-input"
                        className="
                            w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 
                            rounded text-sm dark:text-neutral-100 px-4 py-3 outline-2 
                            dark:outline-purple-300 placeholder-dark:text-neutral-500 
                            placeholder-dark:opacity-50"
                        placeholder={TITLE_PLACEHOLDER}
                    />
                </div>
                <div>
                    <label
                        htmlFor="description-input"
                        className="dark:text-neutral-100 text-xs block mb-2"
                    >
                        Description
                    </label>
                    <textarea
                        id="description-input"
                        className="
                            w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 
                            rounded text-sm dark:text-neutral-100 px-4 py-3 outline-2 
                            dark:outline-purple-300 placeholder-dark:text-neutral-500 
                            placeholder-dark:opacity-50"
                        rows={4}
                        placeholder={DESCRIPTION_PLACEHOLDER}
                    ></textarea>
                </div>
                <SubtaskInputList />
                <div>
                    <label
                        htmlFor="status-select"
                        className="dark:text-neutral-100 text-xs block mb-2"
                    >
                        Status
                    </label>
                    <select
                        className="
                            appearance-none w-full dark:bg-neutral-700 border-[1px] 
                            dark:border-neutral-600 rounded text-sm dark:text-neutral-100 
                            px-4 py-3 outline-2 dark:outline-purple-300 
                            bg-[url('../public/arrow-down.svg')] bg-no-repeat bg-[center_right_1rem]"
                        name="status"
                        id="status-select"
                    >
                        {selectOptions}
                    </select>
                </div>
                <ActionButton
                    isWidthFull={true}
                    bgColor="dark:bg-purple-600"
                    textColor="dark:text-neutral-100"
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
