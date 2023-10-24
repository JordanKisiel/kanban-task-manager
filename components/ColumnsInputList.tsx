import Image from "next/image"
import addIcon from "@/public/plus-icon-purple.svg"
import RemovableInput from "./RemovableInput"
import ActionButton from "./ActionButton"

type Props = {
    columnNames: string[]
    handleAddColumn: Function
    handleChangeColumn: Function
    handleDeleteColumn: Function
}

const COLUMN_PLACEHOLDER_1 = "e.g. Todo"
const COLUMN_PLACEHOLDER_OTHER = "New Column"

export default function ColumnInputList({
    columnNames,
    handleAddColumn,
    handleChangeColumn,
    handleDeleteColumn,
}: Props) {
    const inputs = columnNames.map((name, index) => {
        return (
            <RemovableInput
                key={index}
                id={index}
                value={columnNames[index]}
                placeholderText={COLUMN_PLACEHOLDER_OTHER}
                handleRemoveInput={handleDeleteColumn}
                handleChangeInput={handleChangeColumn}
            />
        )
    })

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-neutral-500 dark:text-neutral-100 text-xs block font-bold">
                Board Columns
            </h4>
            {inputs}
            <ActionButton
                isWidthFull={true}
                bgColor="bg-neutral-300 dark:bg-neutral-100"
                textColor="text-purple-600"
                textSize="text-sm"
                handler={handleAddColumn}
            >
                <Image
                    className="w-[3%] mt-[0.1rem]"
                    src={addIcon}
                    alt="Add icon"
                />
                Add New Column
            </ActionButton>
        </div>
    )
}
