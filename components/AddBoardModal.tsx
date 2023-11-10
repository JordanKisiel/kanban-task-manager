"use client"

import { useState } from "react"
import { addBoard } from "@/lib/dataUtils"
import ActionButton from "./ActionButton"
import ColumnInputList from "./ColumnsInputList"
import MenuButton from "./MenuButton"
import ModalHeader from "./ModalHeader"
import ModalLabel from "./ModalLabel"

type Props = {
    setIsBoardNewlyCreated: Function
    handleBackToBoard: Function
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function AddBoardModal({
    setIsBoardNewlyCreated,
    handleBackToBoard,
}: Props) {
    const [title, setTitle] = useState("")
    const [columnNames, setColumnNames] = useState<string[]>([])

    const menuOptions = [
        {
            actionName: "Close",
            action: () => {
                handleBackToBoard()
            },
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

    //hard-coding userId for now
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        let fetchRes

        const addRes = await addBoard(
            "be0fc8c3-496f-4ed8-9f27-32dcc66bba24",
            title,
            columnNames
        )

        if (addRes && addRes.ok) {
            setIsBoardNewlyCreated(true)
        }

        handleBackToBoard()

        return fetchRes
    }

    return (
        <form
            onSubmit={(e) => {
                handleSubmit(e)
            }}
            className="flex flex-col gap-6"
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
            <ColumnInputList
                columnNames={columnNames}
                handleAddColumn={handleAddColumn}
                handleChangeColumn={handleChangeColumn}
                handleDeleteColumn={handleDeleteColumn}
            />
            <div>
                <ActionButton
                    bgColor="bg-purple-600"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    isWidthFull={true}
                    isSubmit={true}
                >
                    Create New Board
                </ActionButton>
            </div>
        </form>
    )
}
