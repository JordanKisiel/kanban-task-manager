"use client"

import { useState, useReducer } from "react"
import { useParams } from "next/navigation"
import { addBoard } from "@/lib/dataUtils"
import ActionButton from "@/components/ui-elements/ActionButton"
import MenuButton from "@/components/ui-elements/MenuButton"
import ModalHeader from "@/components/modals/ModalHeader"
import ModalLabel from "@/components/modals/ModalLabel"
import ErrorMessage from "@/components/ui-elements/ErrorMessage"
import DynamicInputList from "@/components/ui-elements/DynamicInputList"
import { addBoardReducer } from "@/reducers/formReducers"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import { BUTTON_TEXT_CREATE_BOARD } from "@/lib/config"

type Props = {
    selectedBoardIndex: number
    setIsModalOpen: Function
    setNewBoardCreated: Function
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function AddBoardModal({
    selectedBoardIndex,
    setIsModalOpen,
    setNewBoardCreated,
}: Props) {
    const router = useRouter()
    const params = useParams<{ user: string }>()

    const queryClient = useQueryClient()

    const [formData, dispatch] = useReducer(addBoardReducer, {
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
        dispatch({
            type: "add_column",
            text: "",
        })
    }

    function handleChangeColumn(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch({
            type: "change_column",
            id: event.target.id,
            text: event.target.value,
        })
    }

    function handleDeleteColumn(colIndex: number) {
        dispatch({
            type: "delete_column",
            index: colIndex,
        })
    }

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch({
            type: "change_title",
            text: event.target.value,
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
                        rounded text-sm dark:text-neutral-100 px-4 py-3 focus:outline-none 
                        focus:border-purple-600 focus:dark:border-purple-600 
                        placeholder-dark:text-neutral-500 placeholder-dark:opacity-50"
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
                    bgHoverColor="hover:bg-purple-300"
                    textColor="text-neutral-100"
                    textSize="text-sm"
                    isWidthFull={true}
                    isSubmit={true}
                    isDisabled={isSubmitted}
                    isLoading={isSubmitted}
                >
                    {BUTTON_TEXT_CREATE_BOARD}
                </ActionButton>
            </div>
        </form>
    )
}
