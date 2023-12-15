"use client"

import Image from "next/image"
import addIcon from "@/public/plus-icon-purple.svg"
import RemovableInput from "./RemovableInput"
import ActionButton from "./ActionButton"

type Props = {
    subTasks: string[]
    handleAddInput: Function
    handleChangeInput: Function
    handleRemoveInput: Function
}

const SUBTASK_PLACEHOLDER_OTHER = "e.g. Another subtask"

export default function SubTaskInputList({
    subTasks,
    handleAddInput,
    handleChangeInput,
    handleRemoveInput,
}: Props) {
    const inputList = subTasks.map((subTask, index) => {
        return (
            <RemovableInput
                key={index}
                id={index}
                placeholderText={SUBTASK_PLACEHOLDER_OTHER}
                handleRemoveInput={handleRemoveInput}
                handleChangeInput={handleChangeInput}
                value={subTask}
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
                    width={12}
                    height={12}
                />
                Add New Subtask
            </ActionButton>
        </div>
    )
}
