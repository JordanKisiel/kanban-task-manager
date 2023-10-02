"use client"

import { useState } from "react"
import Image from "next/image"
import addIcon from "@/public/plus-icon-purple.svg"
import RemovableInput from "./RemovableInput"
import ActionButton from "./ActionButton"
import { Column } from "@/types"

type Props = {
    existingColumns: Column[]
}

const COLUMN_PLACEHOLDER_1 = "e.g. Todo"
const COLUMN_PLACEHOLDER_OTHER = "New Column"

export default function ColumnInputList({ existingColumns }: Props) {
    const existingColumnNames = existingColumns.map((column) => {
        return column.title
    })

    const [inputs, setInputs] = useState<string[]>(() => {
        if (existingColumnNames.length === 0) {
            return [COLUMN_PLACEHOLDER_1]
        } else {
            return existingColumnNames
        }
    })

    function handleAddInput() {
        setInputs((prevArray) => [...prevArray, COLUMN_PLACEHOLDER_OTHER])
    }

    function handleRemoveInput(columnIndex: number) {
        setInputs((prevArray) => {
            return prevArray.filter((input, index) => index !== columnIndex)
        })
    }

    const inputList = inputs.map((input, index) => {
        if (!existingColumnNames.includes(input)) {
            return (
                <RemovableInput
                    key={index}
                    id={index}
                    placeholderText={input}
                    handleRemoveInput={handleRemoveInput}
                />
            )
        } else {
            return (
                <RemovableInput
                    key={index}
                    id={index}
                    placeholderText={COLUMN_PLACEHOLDER_OTHER}
                    value={input}
                    handleRemoveInput={handleRemoveInput}
                />
            )
        }
    })

    return (
        <div className="flex flex-col gap-2">
            <h4 className="text-neutral-100 text-xs block">Board Columns</h4>
            {inputList}
            <ActionButton
                isWidthFull={true}
                bgColor="bg-neutral-100"
                textColor="text-purple-600"
                textSize="text-sm"
                handler={handleAddInput}
            >
                <Image
                    className="w-[3%] mt-[0.25rem]"
                    src={addIcon}
                    alt="Add icon"
                />
                Add New Column
            </ActionButton>
        </div>
    )
}
