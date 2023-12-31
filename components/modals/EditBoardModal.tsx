import { useState } from "react"
import { useRouter } from "next/navigation"
import ActionButton from "@/components/ui-elements/ActionButton"
import MenuButton from "@/components/ui-elements/MenuButton"
import ModalHeader from "@/components/modals/ModalHeader"
import ModalLabel from "@/components/modals/ModalLabel"
import DynamicInputList from "@/components/ui-elements/DynamicInputList"
import ErrorMessage from "@/components/ui-elements/ErrorMessage"
import { editBoard } from "@/lib/dataUtils"
import { Board } from "@/types"
import { useMutation, useQueryClient } from "@tanstack/react-query"

type Props = {
    selectedBoardIndex: number
    board: Board
    setIsModalOpen: Function
}

type FormData = {
    title: string
    columns: {
        create: string[]
        update: {
            id: number
            title: string
        }[]
        delete: {
            id: number
        }[]
    }
}

const TITLE_PLACEHOLDER = "e.g. Web Design"

export default function EditBoardModal({
    selectedBoardIndex,
    board,
    setIsModalOpen,
}: Props) {
    const router = useRouter()

    const queryClient = useQueryClient()

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

    //initialize with data from board
    //all existing columns are added to update
    const [formData, setFormData] = useState<FormData>({
        title: board.title,
        columns: {
            create: [],
            update: board.columns.map((column) => {
                //TODO: could I just spread the cols here?
                return {
                    id: column.id,
                    title: column.title,
                }
            }),
            delete: [],
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
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                title: event.target.value,
            }
        })
    }

    function handleAddColumn() {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                columns: {
                    ...prevFormData.columns,
                    create: [...prevFormData.columns.create, ""],
                },
            }
        })
    }

    // mapping the CREATE array:
    //   -we look for (inputIndex - UPDATE.length) === index
    //   -because the update array is always rendered before the create array
    // mapping the UPDATE array:
    //   -we look for inputIndex === index
    // and there is never mapping for DELETE
    //   -because it's never rendered
    function handleChangeColumn(
        event: React.ChangeEvent<HTMLInputElement>,
        inputIndex: number
    ) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                columns: {
                    create: prevFormData.columns.create.map((column, index) => {
                        if (
                            inputIndex - prevFormData.columns.update.length ===
                            index
                        ) {
                            return event.target.value
                        } else {
                            return column
                        }
                    }),
                    update: prevFormData.columns.update.map((column, index) => {
                        if (inputIndex === index) {
                            return {
                                id: column.id,
                                title: event.target.value,
                            }
                        } else {
                            return column
                        }
                    }),
                    delete: [...prevFormData.columns.delete],
                },
            }
        })
    }

    // filtering the CREATE array:
    //   -we look for (inputIndex - UPDATE.length) !== index
    //   -because the update array is always rendered before the create array
    // filtering the UPDATE array:
    //   -we look for inputIndex !== index
    // for the DELETE array:
    //   -we look for inputIndex === index in the UPDATE array
    //   -because that's the item that already exists in the DB that will
    //    have to be removed
    //   -DELETE is also processed first so we can find the item to remove
    //    before filtering it from UPDATE
    function handleRemoveColumn(inputIndex: number) {
        setFormData((prevFormData) => {
            return {
                ...prevFormData,
                columns: {
                    create: prevFormData.columns.create.filter(
                        (column, index) => {
                            return (
                                inputIndex -
                                    prevFormData.columns.update.length !==
                                index
                            )
                        }
                    ),
                    delete: [
                        ...prevFormData.columns.delete,
                        ...prevFormData.columns.update.filter(
                            (column, index) => {
                                return inputIndex === index
                            }
                        ),
                    ],
                    update: prevFormData.columns.update.filter(
                        (column, index) => {
                            return inputIndex !== index
                        }
                    ),
                },
            }
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
                        rounded text-sm dark:text-neutral-100 px-4 py-3 outline-2 
                        dark:outline-purple-300 placeholder-dark:text-neutral-500 
                        placeholder-dark:opacity-50"
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
                        textColor="text-neutral-100"
                        textSize="text-sm"
                        isSubmit={true}
                        isDisabled={isSubmitted}
                        isLoading={isSubmitted}
                    >
                        Save Board Changes
                    </ActionButton>
                </div>
            </form>
        </div>
    )
}
