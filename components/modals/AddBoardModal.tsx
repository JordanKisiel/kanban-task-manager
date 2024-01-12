"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { addBoard } from "@/lib/dataUtils"
import ActionButton from "@/components/ui-elements/ActionButton"
import MenuButton from "@/components/ui-elements/MenuButton"
import ModalHeader from "@/components/modals/ModalHeader"
import ModalLabel from "@/components/modals/ModalLabel"
import ErrorMessage from "@/components/ui-elements/ErrorMessage"
import DynamicInputList from "@/components/ui-elements/DynamicInputList"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"

type Props = {
    selectedBoardIndex: number
    setIsModalOpen: Function
    setNewBoardCreated: Function
}

type FormData = {
    title: string
    columnTitles: string[]
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function AddBoardModal({
    selectedBoardIndex,
    setIsModalOpen,
    setNewBoardCreated,
}: Props) {
    const router = useRouter()
    const params = useParams<{ user: string }>()
    console.log(params)

    const queryClient = useQueryClient()

    const [formData, setFormData] = useState<FormData>({
        title: "",
        columnTitles: [],
    })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [displayError, setDisplayError] = useState<boolean>(true)

    const addBoardMutation = useMutation({
        mutationFn: addBoard,
        onMutate: () => {
            setIsSubmitted(true)
            setDisplayError(true)
        },
        onSuccess: () => {
            setIsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ["boardsData"] })
            setNewBoardCreated(true)
        },
        onError: () => {
            setIsSubmitted(false)
            console.log(
                "There was an error during submission. Please try again."
            )
        },
    })

    const menuOptions = [
        {
            actionName: "Close",
            action: () => {
                setIsModalOpen(false)
                router.push(`?board=${selectedBoardIndex}`)
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

    function handleCloseError() {
        setDisplayError(false)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        addBoardMutation.mutate({
            userId: params.user,
            title: formData.title,
            columnTitles: formData.columnTitles,
        })
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
            {addBoardMutation.isError && displayError && (
                <ErrorMessage
                    message="There was a problem adding the board. Please try again."
                    close={handleCloseError}
                />
            )}
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
