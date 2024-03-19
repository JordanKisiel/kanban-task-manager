import { useState, useReducer } from "react"
import { useRouter } from "next/navigation"
import ActionButton from "@/components/ui-elements/ActionButton"
import MenuButton from "@/components/ui-elements/MenuButton"
import ModalHeader from "@/components/modals/ModalHeader"
import ModalLabel from "@/components/modals/ModalLabel"
import DynamicInputList from "@/components/ui-elements/DynamicInputList"
import ErrorMessage from "@/components/ui-elements/ErrorMessage"
import { editBoard } from "@/lib/dataUtils"
import { editBoardReducer } from "@/reducers/formReducers"
import { Board } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BUTTON_TEXT_EDIT_BOARD } from "@/lib/config"

type Props = {
    selectedBoardIndex: number
    board: Board
    setIsModalOpen: Function
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function EditBoardModal({
    selectedBoardIndex,
    board,
    setIsModalOpen,
}: Props) {
    const router = useRouter()

    const queryClient = useQueryClient()

    //initialize with data from board
    //all existing columns are added to update
    const [formData, dispatch] = useReducer(editBoardReducer, {
        title: board.title,
        columns: {
            create: [],
            update: board.columns.map((column) => {
                return {
                    id: column.id,
                    title: column.title,
                }
            }),
            delete: [],
        },
    })

    const editBoardMutation = useMutation({
        mutationFn: editBoard,
        onMutate: () => {
            setIsSubmitted(true)
            setDisplayError(true)
        },
        onSuccess: () => {
            setIsModalOpen(false)
            queryClient.invalidateQueries({ queryKey: ["boardsData"] })
        },
        onError: () => {
            setIsSubmitted(false)
            console.log("There was an error. Please try again")
        },
    })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [displayError, setDisplayError] = useState<boolean>(true)

    const columnTitles: string[] = [
        ...formData.columns.update.map((column) => column.title),
        ...formData.columns.create,
    ]

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

    function handleTitleChange(event: React.ChangeEvent<HTMLInputElement>) {
        dispatch({
            type: "change_title",
            text: event.target.value,
        })
    }

    function handleAddColumn() {
        dispatch({
            type: "add_column",
            text: "",
        })
    }

    function handleChangeColumn(
        event: React.ChangeEvent<HTMLInputElement>,
        inputIndex: number
    ) {
        dispatch({
            type: "change_column",
            index: inputIndex,
            text: event.target.value,
        })
    }

    function handleRemoveColumn(inputIndex: number) {
        dispatch({
            type: "remove_column",
            index: inputIndex,
        })
    }

    function handleCloseError() {
        setDisplayError(false)
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        editBoardMutation.mutate({
            boardId: board.id,
            title: formData.title,
            columns: {
                create: [...formData.columns.create],
                update: [...formData.columns.update],
                delete: [...formData.columns.delete],
            },
        })
    }

    return (
        <div className={`${isSubmitted ? "opacity-50" : "opacity-100"}`}>
            <form
                onSubmit={(e) => {
                    handleSubmit(e)
                }}
                className="flex flex-col gap-6"
            >
                {editBoardMutation.isError && displayError && (
                    <ErrorMessage
                        message="There was a problem editing the board. Please try again."
                        close={handleCloseError}
                    />
                )}
                <div className="flex flex-row justify-between">
                    <ModalHeader>Edit Board</ModalHeader>
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
                    title="Columns"
                    values={columnTitles}
                    initialPlaceholder="e.g. Todo"
                    addNewText="Add New Column"
                    handleAddInput={handleAddColumn}
                    handleChangeInput={handleChangeColumn}
                    handleRemoveInput={handleRemoveColumn}
                />
                <div>
                    <ActionButton
                        isWidthFull={true}
                        bgColor="bg-purple-600"
                        bgHoverColor="hover:bg-purple-300"
                        textColor="text-neutral-100"
                        textSize="text-sm"
                        isSubmit={true}
                        isDisabled={isSubmitted}
                        isLoading={isSubmitted}
                    >
                        {BUTTON_TEXT_EDIT_BOARD}
                    </ActionButton>
                </div>
            </form>
        </div>
    )
}
