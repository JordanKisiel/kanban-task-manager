"use client"

import { useState } from "react"
import Image from "next/image"
import addIcon from "@/public/plus-icon-purple.svg"
import RemovableInput from "./RemovableInput"
import ActionButton from "./ActionButton"

const COLUMN_PLACEHOLDER_1 = "e.g. Todo"
const COLUMN_PLACEHOLDER_OTHER = "New Column"

export default function SubtaskInputList() {
    const [inputs, setInputs] = useState<string[]>([COLUMN_PLACEHOLDER_1])

    function handleAddInput() {
        setInputs((prevArray) => [...prevArray, COLUMN_PLACEHOLDER_OTHER])
    }

    function handleRemoveInput(columnIndex: number) {
        setInputs((prevArray) => {
            return prevArray.filter((input, index) => index !== columnIndex)
        })
    }

    const inputList = inputs.map((input, index) => {
        return (
            <RemovableInput
                key={index}
                id={index}
                placeholderText={input}
                handleRemoveInput={handleRemoveInput}
            />
        )
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
