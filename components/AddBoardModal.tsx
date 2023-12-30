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

type FormData = {
    title: string
    columnTitles: string[]
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function AddBoardModal({
    setIsModalOpen,
    setNewBoardCreated,
}: Props) {
    const [formData, setFormData] = useState<FormData>({
        title: "",
        columnTitles: [],
    })

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
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                columnTitles: [...prevFormData.columnTitles, ""],
            }
        })
    }

    function handleChangeColumn(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                columnTitles: prevFormData.columnTitles.map(
                    (columnTitle, index) => {
                        if (index.toString() === event.target.id) {
                            return event.target.value
                        } else {
                            return columnTitle
                        }
                    }
                ),
            }
        })
    }

    function handleDeleteColumn(colIndex: number) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                columnTitles: prevFormData.columnTitles.filter(
                    (columnTitle, index) => {
                        return index !== colIndex
                    }
                ),
            }
        })
    }

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                title: event.target.value,
            }
        })
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        setIsSubmitted(true)

        const res = await addBoard(testUserId, formData)

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
                    value={formData.title}
                />
            </div>
            <DynamicInputList
                values={formData.columnTitles}
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
