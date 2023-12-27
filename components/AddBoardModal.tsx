"use client"

import { useState } from "react"
import { addBoard } from "@/lib/dataUtils"
import ActionButton from "./ActionButton"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import ModalLabel from "./ModalLabel"
import { testUserId } from "@/testing/testingConsts"
import DynamicInputList from "./DynamicInputList"

type Props = {
    setIsModalOpen: Function
    setNewBoardCreated: Function
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function AddBoardModal({
    setIsModalOpen,
    setNewBoardCreated,
}: Props) {
    const [title, setTitle] = useState("")
    const [columnNames, setColumnNames] = useState<string[]>([])
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const menuOptions = [
        {
            actionName: "Close",
            action: () => {
                setIsModalOpen()
            },
            isDisabled: false,
        },
    ]

    function handleAddColumn() {
        setColumnNames((prevCols) => [...prevCols, ""])
    }

    function handleChangeColumn(event: React.ChangeEvent<HTMLInputElement>) {
        setColumnNames((prevColumns) => {
            return prevColumns.map((column, index) => {
                if (`${index}` === event.target.id) {
                    return event.target.value
                } else {
                    return column
                }
            })
        })
    }

    function handleDeleteColumn(colIndex: number) {
        setColumnNames((prevCols) => {
            return prevCols.filter((column, index) => {
                return colIndex !== index
            })
        })
    }

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setTitle(event.target.value)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setIsSubmitted(true)

        const res = await addBoard(testUserId, title, columnNames)

        // if (res && res.ok) {
        //     mutate(
        //         (key) => typeof key === "string" && key.includes("/api/boards"),
        //         undefined,
        //         { revalidate: true }
        //     )

        //     setNewBoardCreated(true)
        // }

        setIsModalOpen()
    }

    return (
        <form
            onSubmit={(e) => {
                handleSubmit(e)
            }}
            className={`${
                isSubmitted ? "opacity-50" : "opacity-100"
            } flex flex-col gap-6`}
        >
            <div className="flex flex-row justify-between">
                <ModalHeader>Add New Board</ModalHeader>
                <MenuButton actions={menuOptions} />
            </div>
            <div>
                <ModalLabel htmlFor="title-input">Board Name</ModalLabel>
                <input
                    onChange={(e) => handleTitleChange(e)}
                    type="text"
                    id="title-input"
                    className="
                        w-full dark:bg-neutral-700 border-[1px] dark:border-neutral-600 
                        rounded text-sm dark:text-neutral-100 px-4 py-3 outline-2 
                        dark:outline-purple-300 placeholder-dark:text-neutral-500 
                        placeholder-dark:opacity-50"
                    placeholder={TITLE_PLACEHOLDER}
                    value={title}
                />
            </div>
            <DynamicInputList
                values={columnNames}
                title="Board Columns"
                initialPlaceholder="e.g. Todo"
                addNewText="Add New Column"
                handleAddInput={handleAddColumn}
                handleChangeInput={handleChangeColumn}
                handleRemoveInput={handleDeleteColumn}
            />
            <div>
                <ActionButton
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    isWidthFull={true}
                    isSubmit={true}
                    isDisabled={isSubmitted}
                    isLoading={isSubmitted}
                >
                    Create New Board
                </ActionButton>
            </div>
        </form>
    )
}
