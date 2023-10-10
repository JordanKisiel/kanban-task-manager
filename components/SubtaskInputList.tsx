"use client"

import { useState } from "react"
import Image from "next/image"
import addIcon from "@/public/plus-icon-purple.svg"
import RemovableInput from "./RemovableInput"
import ActionButton from "./ActionButton"

const SUBTASK_PLACEHOLDER_1 = "e.g. Make coffee"
const SUBTASK_PLACEHOLDER_2 = "e.g. Drink coffee & smile"
const SUBTASK_PLACEHOLDER_OTHER = "e.g. Another subtask"

export default function SubtaskInputList() {
    const [inputs, setInputs] = useState<string[]>([SUBTASK_PLACEHOLDER_1])

    function handleAddInput() {
        if (inputs.length === 0) {
            setInputs((prevArray) => [...prevArray, SUBTASK_PLACEHOLDER_1])
        } else if (inputs.length === 1) {
            setInputs((prevArray) => [...prevArray, SUBTASK_PLACEHOLDER_2])
        } else {
            setInputs((prevArray) => [...prevArray, SUBTASK_PLACEHOLDER_OTHER])
        }
    }

    function handleRemoveInput(subtaskIndex: number) {
        setInputs((prevArray) => {
            return prevArray.filter((input, index) => index !== subtaskIndex)
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
            <h4 className="text-neutral-500 dark:text-neutral-100 text-xs block font-bold">
                Subtasks
            </h4>
            {inputList}
            <ActionButton
                isWidthFull={true}
                bgColor="bg-neutral-300 dark:bg-neutral-100"
                textColor="text-purple-600"
                textSize="text-sm"
                handler={handleAddInput}
            >
                <Image
                    className="w-[3%] mt-[0.25rem]"
                    src={addIcon}
                    alt="Add icon"
                />
                Add New Subtask
            </ActionButton>
        </div>
    )
}
